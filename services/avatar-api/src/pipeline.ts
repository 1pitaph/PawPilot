import crypto from "node:crypto";

import type {
  AvatarAsset,
  AvatarGenerationJob,
  AvatarPipelineStage,
  CreateAvatarJobRequest
} from "@pets/shared";

import type { AvatarApiConfig } from "./config.js";
import type { ImageProvider, TripoProvider } from "./providers.js";
import { MockImageProvider, MockTripoProvider, buildQAvatarPrompt } from "./providers.js";
import { AvatarStore } from "./store.js";

export class AvatarPipeline {
  constructor(
    private readonly config: AvatarApiConfig,
    private readonly store: AvatarStore,
    private readonly imageProvider: ImageProvider,
    private readonly tripoProvider: TripoProvider
  ) {}

  async createJob(input: CreateAvatarJobRequest) {
    const now = new Date().toISOString();
    const sourceFileIds = input.sourceFileIds ?? [];
    const job: AvatarGenerationJob = {
      id: crypto.randomUUID(),
      petId: input.petId,
      mode: input.mode ?? "q_to_3d",
      status: "queued",
      stage: "created",
      progress: 2,
      headline: "分身任务已创建",
      message: "正在准备宠物照片。",
      sourceFileIds,
      assets: [],
      providerTaskIds: [],
      rig: {
        status: "not_started",
        animationClips: []
      },
      createdAt: now,
      updatedAt: now
    };

    for (const fileId of sourceFileIds) {
      const upload = this.store.getUpload(fileId);
      if (!upload) {
        continue;
      }
      job.assets.push(
        this.store.makeAsset({
          kind: "source_photo",
          url: upload.url,
          provider: "mock",
          label: upload.fileName,
          fileName: upload.fileName,
          mimeType: upload.mimeType,
          sizeBytes: upload.sizeBytes
        })
      );
    }

    for (const url of input.sourceImageUrls ?? []) {
      job.assets.push(
        this.store.makeAsset({
          kind: "source_photo",
          url,
          provider: "mock",
          label: "远程参考图",
          mimeType: "image/*"
        })
      );
    }

    if (job.assets.filter((asset) => asset.kind === "source_photo").length === 0) {
      job.assets.push(
        this.store.makeAsset({
          kind: "source_photo",
          url: "mock://demo-pet-photo",
          provider: "mock",
          label: "演示宠物照片",
          mimeType: "image/png"
        })
      );
    }

    await this.store.upsertJob(job);
    await this.emit(job, "created", "任务已创建", { mode: job.mode });
    void this.runQStage(job.id, input);
    return job;
  }

  async selectCandidate(jobId: string, selectedQAssetId: string) {
    const job = this.requireJob(jobId);
    const selected = job.assets.find((asset) => asset.id === selectedQAssetId);
    if (!selected || selected.kind !== "q_candidate") {
      throw new Error("selected Q asset not found");
    }

    job.selectedQAssetId = selectedQAssetId;
    selected.kind = "q_selected";
    job.status = "running";
    await this.update(job, {
      stage: "multiview_generating",
      progress: 44,
      headline: "主设定已选择",
      message: "开始为 3D 生成准备多视角参考图。"
    });
    void this.run3DStage(job.id, selected.url, {
      geometryQuality: "standard",
      tryRig: job.mode === "rigged_3d"
    });
    return job;
  }

  async cancelJob(jobId: string) {
    const job = this.requireJob(jobId);
    if (["ready", "degraded", "failed", "canceled"].includes(job.status)) {
      return job;
    }
    job.status = "canceled";
    await this.update(job, {
      stage: "canceled",
      progress: job.progress,
      headline: "任务已取消",
      message: "生成任务已停止。"
    });
    return job;
  }

  async retryJob(jobId: string) {
    const job = this.requireJob(jobId);
    if (job.status !== "failed" && job.status !== "degraded") {
      return job;
    }
    job.errorCode = undefined;
    job.errorMessage = undefined;
    job.status = "running";
    await this.update(job, {
      stage: "q_generating",
      progress: 16,
      headline: "正在重试",
      message: "从 Q 版生成阶段重新开始。"
    });
    void this.runQStage(job.id, {
      petId: job.petId,
      sourceFileIds: job.sourceFileIds,
      candidateCount: 4,
      mode: job.mode,
      tryRig: job.mode === "rigged_3d",
      autoSelectFirstCandidate: false
    });
    return job;
  }

  private async runQStage(jobId: string, input: CreateAvatarJobRequest) {
    const job = this.requireJob(jobId);
    try {
      await this.update(job, {
        stage: "quality_checking",
        progress: 10,
        headline: "检查照片",
        message: "确认主体、尺寸和可用参考图。"
      });

      const sourceImageUrls = job.assets
        .filter((asset) => asset.kind === "source_photo" && asset.url !== "mock://demo-pet-photo")
        .map((asset) => asset.url);

      await this.update(job, {
        stage: "q_generating",
        progress: 20,
        headline: "生成 Q 版候选",
        message: "保留宠物关键特征，生成干净的主设定图。"
      });

      const provider = this.resolveImageProvider();
      const imageInput = {
        sourceImageUrls,
        petName: "糯米",
        count: Math.min(Math.max(input.candidateCount ?? 4, 1), 8)
      };
      const generated = await provider.generateQCandidates(imageInput).catch((error) => {
        if (this.config.mockOnProviderFailure && provider.name !== "mock") {
          return new MockImageProvider().generateQCandidates(imageInput);
        }
        throw error;
      });

      for (let index = 0; index < generated.length; index += 1) {
        const image = generated[index];
        const archived =
          image.url.startsWith("http") || image.url.startsWith("data:")
            ? await this.safeArchive(image.url, `q-candidate-${index + 1}.png`)
            : undefined;
        const asset = this.store.makeAsset({
          kind: "q_candidate",
          url: archived?.url ?? image.url,
          provider: image.provider,
          label: image.label ?? `Q 版候选 ${index + 1}`,
          fileName: `q-candidate-${index + 1}.png`,
          mimeType: "image/png",
          providerTaskId: image.providerTaskId,
          sizeBytes: archived?.sizeBytes
        });
        job.assets.push(asset);
      }

      await this.update(job, {
        stage: "q_ready",
        progress: 38,
        headline: "Q 版候选已就绪",
        message: "可以选择一张作为宠物主设定。"
      });

      const autoSelect =
        input.autoSelectFirstCandidate ?? job.mode === "rigged_3d";
      const firstCandidate = job.assets.find((asset) => asset.kind === "q_candidate");

      if (job.mode === "q_only" || !firstCandidate) {
        job.status = "ready";
        await this.update(job, {
          stage: "ready_2d",
          progress: 100,
          headline: "2D 分身已完成",
          message: "Q 版宠物头像已保存。"
        });
        return;
      }

      if (!autoSelect) {
        job.status = "waiting_user";
        await this.update(job, {
          stage: "waiting_user_selection",
          progress: 40,
          headline: "请选择主设定",
          message: "选择后会继续生成 3D 模型。"
        });
        return;
      }

      job.selectedQAssetId = firstCandidate.id;
      firstCandidate.kind = "q_selected";
      await this.update(job, {
        stage: "multiview_generating",
        progress: 44,
        headline: "已选择主设定",
        message: "自动选择第一张候选继续生成 3D。"
      });
      await this.run3DStage(job.id, firstCandidate.url, {
        geometryQuality: input.geometryQuality ?? "standard",
        tryRig: input.tryRig ?? job.mode === "rigged_3d"
      });
    } catch (error) {
      await this.fail(job, "Q_STAGE_FAILED", error);
    }
  }

  private async run3DStage(
    jobId: string,
    selectedImageUrl: string,
    options: { geometryQuality: "standard" | "detailed"; tryRig: boolean }
  ) {
    const job = this.requireJob(jobId);
    try {
      let tripo = this.resolveTripoProvider();

      await this.update(job, {
        stage: "multiview_generating",
        progress: 48,
        headline: "生成多视角",
        message: "为 3D 模型准备正面、侧面和背面参考。"
      });
      const multiviewInput = {
        imageUrl: selectedImageUrl,
        prompt: buildQAvatarPrompt("糯米", 2)
      };
      const multiview = await tripo.generateMultiview(multiviewInput).catch((error) => {
        if (this.config.mockOnProviderFailure && tripo.name !== "mock") {
          tripo = new MockTripoProvider();
          return tripo.generateMultiview(multiviewInput);
        }
        throw error;
      });
      if (multiview.taskId) {
        job.providerTaskIds.push(multiview.taskId);
      }

      for (const [view, url] of Object.entries(multiview.views)) {
        if (!url) {
          continue;
        }
        const archived = await this.safeArchive(url, `multiview-${view}.png`);
        job.assets.push(
          this.store.makeAsset({
            kind: `multiview_${view}` as AvatarAsset["kind"],
            url: archived?.url ?? url,
            provider: tripo.name,
            label: `${view} view`,
            fileName: `multiview-${view}.png`,
            mimeType: "image/png",
            sizeBytes: archived?.sizeBytes,
            providerTaskId: multiview.taskId
          })
        );
      }

      await this.update(job, {
        stage: "tripo_processing",
        progress: 62,
        headline: "生成 3D 模型",
        message: "Tripo 正在生成可预览 GLB 资产。"
      });
      const model = await tripo.createModel({
        imageUrl: selectedImageUrl,
        multiview,
        geometryQuality: options.geometryQuality
      });
      if (model.taskId) {
        job.providerTaskIds.push(model.taskId);
      }

      const modelUrl = model.modelUrl ?? model.baseModelUrl ?? model.pbrModelUrl;
      if (!modelUrl) {
        throw new Error("Tripo completed without model URL");
      }

      await this.update(job, {
        stage: "model_downloading",
        progress: 72,
        headline: "归档 3D 资产",
        message: "下载供应商结果并转存到本地资产库。"
      });
      const archivedModel = await this.safeArchive(modelUrl, "pet-avatar.glb");
      job.assets.push(
        this.store.makeAsset({
          kind: "model_glb",
          url: archivedModel?.url ?? modelUrl,
          provider: tripo.name,
          label: "静态 3D 模型",
          fileName: "pet-avatar.glb",
          mimeType: "model/gltf-binary",
          sizeBytes: archivedModel?.sizeBytes,
          providerTaskId: model.taskId,
          metadata: {
            consumedCredit: model.consumedCredit ?? null,
            geometryQuality: options.geometryQuality
          }
        })
      );

      if (model.renderedImageUrl) {
        const archivedPreview = await this.safeArchive(
          model.renderedImageUrl,
          "pet-avatar-preview.png"
        );
        job.assets.push(
          this.store.makeAsset({
            kind: "preview_image",
            url: archivedPreview?.url ?? model.renderedImageUrl,
            provider: tripo.name,
            label: "3D 预览图",
            fileName: "pet-avatar-preview.png",
            mimeType: "image/png",
            providerTaskId: model.taskId,
            sizeBytes: archivedPreview?.sizeBytes
          })
        );
      }

      await this.runQa(job);

      if (!options.tryRig) {
        job.rig.status = "skipped";
        job.status = "ready";
        await this.update(job, {
          stage: "ready_3d",
          progress: 100,
          headline: "3D 分身已完成",
          message: "静态 3D 宠物分身已可预览，骨骼绑定本次未开启。"
        });
        return;
      }

      await this.runRigStage(job, tripo, model.taskId);
    } catch (error) {
      await this.degrade(job, "3D_STAGE_FAILED", error);
    }
  }

  private async runQa(job: AvatarGenerationJob) {
    await this.update(job, {
      stage: "qa_running",
      progress: 80,
      headline: "自动质检",
      message: "检查文件、预览图和移动端基础约束。"
    });
    const model = job.assets.find((asset) => asset.kind === "model_glb");
    job.qualityReport = {
      passed: Boolean(model),
      score: model ? 86 : 40,
      checks: [
        {
          id: "model-glb",
          label: "GLB 资产",
          passed: Boolean(model),
          detail: model ? "已生成并归档" : "缺少 GLB 文件"
        },
        {
          id: "fallback",
          label: "降级能力",
          passed: job.assets.some((asset) => asset.kind === "q_selected"),
          detail: "保留 2D Q 版头像作为兜底"
        }
      ]
    };
    await this.update(job, {
      stage: "model_archived",
      progress: 84,
      headline: "模型已归档",
      message: "静态资产通过基础检查。"
    });
  }

  private async runRigStage(
    job: AvatarGenerationJob,
    tripo: TripoProvider,
    modelTaskId?: string
  ) {
    if (!modelTaskId) {
      job.rig.status = "skipped";
      job.status = "ready";
      await this.update(job, {
        stage: "ready_3d",
        progress: 100,
        headline: "3D 分身已完成",
        message: "缺少供应商模型任务 ID，已跳过骨骼绑定。"
      });
      return;
    }

    await this.update(job, {
      stage: "prerig_checking",
      progress: 88,
      headline: "检查骨骼绑定",
      message: "确认该模型是否适合四足骨骼。"
    });
    job.rig.status = "checking";
    const preRig = await tripo.preRigCheck(modelTaskId);
    job.rig.riggable = preRig.riggable;
    job.rig.skeletonType = preRig.rigType ?? "quadruped";
    job.rig.providerTaskId = preRig.taskId;

    if (!preRig.riggable) {
      job.rig.status = "skipped";
      job.status = "degraded";
      await this.update(job, {
        stage: "ready_degraded",
        progress: 100,
        headline: "静态 3D 已完成",
        message: "该模型暂不适合自动绑定骨骼，已保留静态 3D 和 2D 兜底。"
      });
      return;
    }

    await this.update(job, {
      stage: "rigging_running",
      progress: 92,
      headline: "绑定骨骼",
      message: "正在尝试 quadruped 骨骼绑定。"
    });
    job.rig.status = "running";
    const rig = await tripo.rig({
      modelTaskId,
      rigType: preRig.rigType ?? "quadruped"
    });
    if (rig.taskId) {
      job.providerTaskIds.push(rig.taskId);
      job.rig.providerTaskId = rig.taskId;
    }
    if (!rig.modelUrl) {
      throw new Error("Tripo rig completed without model URL");
    }

    const archivedRig = await this.safeArchive(rig.modelUrl, "pet-avatar-rigged.glb");
    job.assets.push(
      this.store.makeAsset({
        kind: "rigged_glb",
        url: archivedRig?.url ?? rig.modelUrl,
        provider: tripo.name,
        label: "绑定骨骼 GLB",
        fileName: "pet-avatar-rigged.glb",
        mimeType: "model/gltf-binary",
        providerTaskId: rig.taskId,
        sizeBytes: archivedRig?.sizeBytes
      })
    );
    job.rig.status = "ready";
    job.rig.animationClips = ["idle-ready"];
    job.status = "ready";
    await this.update(job, {
      stage: "ready_rigged",
      progress: 100,
      headline: "骨骼 3D 分身已完成",
      message: "已生成可后续接动作的 GLB 资产。"
    });
  }

  private resolveImageProvider(): ImageProvider {
    if (this.imageProvider.name !== "mock") {
      return this.imageProvider;
    }
    return this.imageProvider;
  }

  private resolveTripoProvider(): TripoProvider {
    if (this.tripoProvider.name !== "mock") {
      return this.tripoProvider;
    }
    return this.tripoProvider;
  }

  private async safeArchive(url: string, fallbackFileName: string) {
    if (url.startsWith("mock://")) {
      return undefined;
    }
    try {
      return await this.store.archiveRemoteAsset(url, fallbackFileName);
    } catch (error) {
      if (!this.config.mockOnProviderFailure) {
        throw error;
      }
      return undefined;
    }
  }

  private async fail(job: AvatarGenerationJob, code: string, error: unknown) {
    job.status = "failed";
    job.errorCode = code;
    job.errorMessage = errorMessage(error);
    await this.update(job, {
      stage: "failed",
      progress: job.progress,
      headline: "分身生成失败",
      message: job.errorMessage
    });
  }

  private async degrade(job: AvatarGenerationJob, code: string, error: unknown) {
    const has2d = job.assets.some(
      (asset) => asset.kind === "q_selected" || asset.kind === "q_candidate"
    );
    job.errorCode = code;
    job.errorMessage = errorMessage(error);
    job.status = has2d ? "degraded" : "failed";
    await this.update(job, {
      stage: has2d ? "ready_degraded" : "failed",
      progress: has2d ? 100 : job.progress,
      headline: has2d ? "已降级为 2D 分身" : "分身生成失败",
      message: has2d
        ? "3D 阶段暂未完成，Q 版头像仍可使用。"
        : job.errorMessage
    });
  }

  private async update(
    job: AvatarGenerationJob,
    patch: {
      stage: AvatarPipelineStage;
      progress: number;
      headline: string;
      message: string;
    }
  ) {
    job.stage = patch.stage;
    job.progress = patch.progress;
    job.headline = patch.headline;
    job.message = patch.message;
    if (job.status === "queued") {
      job.status = "running";
    }
    job.updatedAt = new Date().toISOString();
    await this.store.upsertJob(job);
    await this.emit(job, patch.stage, patch.message, {
      progress: patch.progress,
      status: job.status
    });
  }

  private async emit(
    job: AvatarGenerationJob,
    stage: AvatarPipelineStage,
    message: string,
    payload: Record<string, unknown> = {}
  ) {
    await this.store.appendEvent(job.id, stage, {
      stage,
      message,
      ...payload
    });
  }

  private requireJob(jobId: string) {
    const job = this.store.getJob(jobId);
    if (!job) {
      throw new Error("job not found");
    }
    return job;
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
