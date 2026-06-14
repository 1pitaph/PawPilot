import zlib from "node:zlib";

import type { AvatarProvider } from "@pets/shared";

import type { AvatarApiConfig } from "./config.js";

export interface GeneratedImage {
  url: string;
  provider: AvatarProvider;
  providerTaskId?: string;
  label?: string;
}

export interface GeneratedMultiview {
  taskId?: string;
  views: {
    front?: string;
    left?: string;
    back?: string;
    right?: string;
  };
}

export interface GeneratedModel {
  taskId?: string;
  modelUrl?: string;
  renderedImageUrl?: string;
  baseModelUrl?: string;
  pbrModelUrl?: string;
  consumedCredit?: number;
}

export interface PreRigResult {
  taskId?: string;
  riggable: boolean;
  rigType?: "biped" | "quadruped" | "hexapod" | "octopod" | "avian" | "serpentine" | "aquatic";
}

export interface RigResult {
  taskId?: string;
  modelUrl?: string;
  renderedImageUrl?: string;
}

export interface ImageProvider {
  readonly name: AvatarProvider;
  generateQCandidates(input: {
    sourceImageUrls: string[];
    petName: string;
    count: number;
  }): Promise<GeneratedImage[]>;
}

export interface TripoProvider {
  readonly name: AvatarProvider;
  generateMultiview(input: {
    imageUrl: string;
    prompt: string;
  }): Promise<GeneratedMultiview>;
  createModel(input: {
    imageUrl: string;
    multiview?: GeneratedMultiview;
    geometryQuality: "standard" | "detailed";
  }): Promise<GeneratedModel>;
  preRigCheck(modelTaskId: string): Promise<PreRigResult>;
  rig(input: {
    modelTaskId: string;
    rigType: NonNullable<PreRigResult["rigType"]>;
  }): Promise<RigResult>;
}

export class MockImageProvider implements ImageProvider {
  readonly name = "mock" as const;

  async generateQCandidates(input: {
    sourceImageUrls: string[];
    petName: string;
    count: number;
  }) {
    return Array.from({ length: input.count }, (_, index) => {
      const variant = index + 1;
      return {
        provider: this.name,
        label: `Q 版候选 ${variant}`,
        url: pngDataUrl(
          input.petName,
          `候选 ${variant}`,
          index % 2 === 0 ? "#A5B2FF" : "#F7C97E"
        ),
        providerTaskId: `mock-image-${variant}`
      };
    });
  }
}

export class ApimartGptImage2Provider implements ImageProvider {
  readonly name = "apimart" as const;

  constructor(private readonly config: AvatarApiConfig) {}

  async generateQCandidates(input: {
    sourceImageUrls: string[];
    petName: string;
    count: number;
  }) {
    if (!this.config.apimartApiKey) {
      throw new Error("APIMART_API_KEY is not configured");
    }

    const outputs: GeneratedImage[] = [];
    for (let index = 0; index < input.count; index += 1) {
      const taskId = await this.submitImageTask({
        prompt: buildQAvatarPrompt(input.petName, index),
        imageUrls: input.sourceImageUrls
      });
      const url = await this.pollImageTask(taskId);
      outputs.push({
        provider: this.name,
        providerTaskId: taskId,
        label: `Q 版候选 ${index + 1}`,
        url
      });
    }
    return outputs;
  }

  private async submitImageTask(input: { prompt: string; imageUrls: string[] }) {
    const response = await fetch(
      `${this.config.apimartBaseUrl.replace(/\/$/, "")}/images/generations`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apimartApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-image-2",
          prompt: input.prompt,
          image_urls: input.imageUrls,
          n: 1,
          size: "1:1",
          resolution: this.config.apimartResolution
        })
      }
    );

    const body = await response.json().catch(() => undefined);
    if (!response.ok) {
      throw new Error(`APIMart submit failed: ${response.status}`);
    }

    const taskId = body?.data?.[0]?.task_id;
    if (!taskId) {
      throw new Error("APIMart submit response missing task_id");
    }
    return String(taskId);
  }

  private async pollImageTask(taskId: string) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < this.config.apimartPollTimeoutMs) {
      await sleep(this.config.apimartPollIntervalMs);
      const response = await fetch(
        `${this.config.apimartBaseUrl.replace(/\/$/, "")}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.apimartApiKey}`
          }
        }
      );
      const body = await response.json().catch(() => undefined);
      if (!response.ok) {
        throw new Error(`APIMart poll failed: ${response.status}`);
      }

      const status = body?.data?.status;
      if (status === "completed") {
        const imageUrl = body?.data?.result?.images?.[0]?.url?.[0];
        if (!imageUrl) {
          throw new Error("APIMart completed without image URL");
        }
        return String(imageUrl);
      }
      if (status === "failed") {
        throw new Error(body?.data?.error?.message ?? "APIMart task failed");
      }
    }
    throw new Error(`APIMart task ${taskId} timed out`);
  }
}

export class MockTripoProvider implements TripoProvider {
  readonly name = "mock" as const;

  async generateMultiview(input: { imageUrl: string; prompt: string }) {
    await sleep(500);
    return {
      taskId: "mock-multiview",
      views: {
        front: input.imageUrl,
        left: pngDataUrl("侧面", "left", "#88C9A1"),
        back: pngDataUrl("背面", "back", "#E6A57E"),
        right: pngDataUrl("右侧", "right", "#88A9C9")
      }
    };
  }

  async createModel() {
    await sleep(900);
    return {
      taskId: "mock-model",
      modelUrl: mockGlbDataUrl(),
      renderedImageUrl: pngDataUrl("3D", "GLB", "#A5B2FF"),
      consumedCredit: 0
    };
  }

  async preRigCheck() {
    await sleep(400);
    return {
      taskId: "mock-prerig",
      riggable: true,
      rigType: "quadruped" as const
    };
  }

  async rig() {
    await sleep(700);
    return {
      taskId: "mock-rig",
      modelUrl: mockGlbDataUrl(),
      renderedImageUrl: pngDataUrl("Rig", "GLB", "#7AC7B7")
    };
  }
}

export class TripoOpenApiProvider implements TripoProvider {
  readonly name = "tripo" as const;

  constructor(private readonly config: AvatarApiConfig) {}

  async generateMultiview(input: { imageUrl: string; prompt: string }) {
    const taskId = await this.submitTask({
      type: "generate_multiview_image",
      file: {
        type: "image",
        url: input.imageUrl
      },
      prompt: input.prompt
    });
    const task = await this.pollTask(taskId);
    const output = task.output?.generate_multiview_image ?? {};
    return {
      taskId,
      views: {
        front: output.front_view_url,
        left: output.left_view_url,
        back: output.back_view_url,
        right: output.right_view_url
      }
    };
  }

  async createModel(input: {
    imageUrl: string;
    multiview?: GeneratedMultiview;
    geometryQuality: "standard" | "detailed";
  }) {
    const taskId =
      input.multiview?.taskId && hasAllViews(input.multiview)
        ? await this.submitTask({
            type: "multiview_to_model",
            original_task_id: input.multiview.taskId,
            model_version: this.config.tripoModelVersion,
            texture: true,
            pbr: true,
            texture_quality: "standard",
            texture_alignment: "geometry",
            orientation: "align_image",
            geometry_quality: input.geometryQuality,
            face_limit: 8000,
            compress: "geometry"
          })
        : await this.submitTask({
            type: "image_to_model",
            file: {
              type: "image",
              url: input.imageUrl
            },
            model_version: this.config.tripoModelVersion,
            texture: true,
            pbr: true,
            texture_quality: "standard",
            texture_alignment: "geometry",
            orientation: "align_image",
            geometry_quality: input.geometryQuality,
            face_limit: 8000,
            compress: "geometry"
          });

    const task = await this.pollTask(taskId);
    return {
      taskId,
      modelUrl: task.output?.model,
      renderedImageUrl: task.output?.rendered_image,
      baseModelUrl: task.output?.base_model,
      pbrModelUrl: task.output?.pbr_model,
      consumedCredit: task.consumed_credit
    };
  }

  async preRigCheck(modelTaskId: string) {
    const taskId = await this.submitTask({
      type: "animate_prerigcheck",
      original_model_task_id: modelTaskId
    });
    const task = await this.pollTask(taskId);
    return {
      taskId,
      riggable: Boolean(task.output?.riggable ?? task.output?.rig_info?.riggable),
      rigType: task.output?.rig_type ?? task.output?.rig_info?.rig_type
    };
  }

  async rig(input: {
    modelTaskId: string;
    rigType: NonNullable<PreRigResult["rigType"]>;
  }) {
    const taskId = await this.submitTask({
      type: "animate_rig",
      original_model_task_id: input.modelTaskId,
      model_version: this.config.tripoRigVersion,
      rig_type: input.rigType,
      spec: "tripo",
      out_format: "glb"
    });
    const task = await this.pollTask(taskId);
    return {
      taskId,
      modelUrl: task.output?.model,
      renderedImageUrl: task.output?.rendered_image
    };
  }

  private async submitTask(payload: Record<string, unknown>) {
    if (!this.config.tripoApiKey) {
      throw new Error("TRIPO_API_KEY is not configured");
    }

    const response = await fetch(
      `${this.config.tripoBaseUrl.replace(/\/$/, "")}/v2/openapi/task`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.tripoApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
    const body = await response.json().catch(() => undefined);
    if (!response.ok || body?.code) {
      throw new Error(body?.message ?? `Tripo submit failed: ${response.status}`);
    }
    const taskId = body?.data?.task_id;
    if (!taskId) {
      throw new Error("Tripo submit response missing task_id");
    }
    return String(taskId);
  }

  private async pollTask(taskId: string): Promise<TripoTaskData> {
    const startedAt = Date.now();
    while (Date.now() - startedAt < this.config.tripoPollTimeoutMs) {
      await sleep(this.config.tripoPollIntervalMs);
      const response = await fetch(
        `${this.config.tripoBaseUrl.replace(/\/$/, "")}/v2/openapi/task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.tripoApiKey}`
          }
        }
      );
      const body = await response.json().catch(() => undefined);
      if (!response.ok || body?.code) {
        throw new Error(body?.message ?? `Tripo poll failed: ${response.status}`);
      }

      const data = body?.data as TripoTaskData | undefined;
      if (!data) {
        throw new Error("Tripo poll response missing data");
      }
      if (data.status === "success") {
        return data;
      }
      if (["failed", "banned", "expired", "cancelled", "unknown"].includes(data.status)) {
        throw new Error(`Tripo task ${taskId} ended with status ${data.status}`);
      }
    }

    throw new Error(`Tripo task ${taskId} timed out`);
  }
}

interface TripoTaskData {
  task_id?: string;
  type?: string;
  status: string;
  output?: Record<string, any>;
  consumed_credit?: number;
}

export function buildProviders(config: AvatarApiConfig) {
  const imageProvider =
    config.providerMode === "mock" || (!config.apimartApiKey && config.providerMode !== "real")
      ? new MockImageProvider()
      : new ApimartGptImage2Provider(config);
  const tripoProvider =
    config.providerMode === "mock" || (!config.tripoApiKey && config.providerMode !== "real")
      ? new MockTripoProvider()
      : new TripoOpenApiProvider(config);

  return { imageProvider, tripoProvider };
}

export function buildQAvatarPrompt(petName: string, variantIndex: number) {
  const variant =
    variantIndex % 3 === 0
      ? "更像真实宠物，保留毛色和斑纹"
      : variantIndex % 3 === 1
        ? "更圆润可爱，适合头像"
        : "轮廓更清晰，适合后续 3D 建模";

  return [
    `基于参考宠物照片生成 ${petName} 的 Q版/chibi 宠物角色形象。`,
    "必须保留宠物种类、毛色、脸部花纹、耳朵形状、尾巴特征、独特斑点或项圈。",
    `风格方向：${variant}。`,
    "大头小身体、圆润玩具质感、全身站姿、正面 3/4 视角。",
    "单只宠物，居中，完整身体，不裁切，无文字、无水印、无复杂背景、无额外动物或人物。"
  ].join("\n");
}

function hasAllViews(multiview: GeneratedMultiview) {
  return Boolean(
    multiview.views.front &&
      multiview.views.left &&
      multiview.views.back &&
      multiview.views.right
  );
}

function pngDataUrl(title: string, subtitle: string, color: string) {
  const width = 512;
  const height = 512;
  const pixels = Buffer.alloc(width * height * 4);
  fillRect(pixels, width, height, 0, 0, width, height, "#FFF8EA");
  fillEllipse(pixels, width, height, 256, 344, 88, 72, color, 0.86);
  fillCircle(pixels, width, height, 256, 216, 118, color);
  fillCircle(pixels, width, height, 194, 178, 24, "#3C3C43");
  fillCircle(pixels, width, height, 318, 178, 24, "#3C3C43");
  fillCircle(pixels, width, height, 204, 168, 8, "#FFFFFF");
  fillCircle(pixels, width, height, 328, 168, 8, "#FFFFFF");
  fillEllipse(pixels, width, height, 256, 258, 32, 20, "#FFFFFF", 0.92);
  drawSmile(pixels, width, height, 214, 272, 298, 272, "#3C3C43");
  drawTextBlocks(pixels, width, height, title, subtitle);
  return `data:image/png;base64,${encodePng(width, height, pixels).toString("base64")}`;
}

function mockGlbDataUrl() {
  const payload = JSON.stringify({
    asset: {
      version: "2.0",
      generator: "pets-avatar-api mock provider"
    },
    scene: 0,
    scenes: [{ nodes: [] }],
    nodes: []
  });
  return `data:application/json;base64,${Buffer.from(payload).toString("base64")}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fillRect(
  pixels: Buffer,
  width: number,
  height: number,
  x: number,
  y: number,
  rectWidth: number,
  rectHeight: number,
  color: string,
  alpha = 1
) {
  const rgb = hexToRgb(color);
  for (let row = y; row < Math.min(y + rectHeight, height); row += 1) {
    for (let col = x; col < Math.min(x + rectWidth, width); col += 1) {
      setPixel(pixels, width, col, row, rgb, alpha);
    }
  }
}

function fillCircle(
  pixels: Buffer,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  alpha = 1
) {
  const rgb = hexToRgb(color);
  for (let row = cy - radius; row <= cy + radius; row += 1) {
    for (let col = cx - radius; col <= cx + radius; col += 1) {
      const dx = col - cx;
      const dy = row - cy;
      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(pixels, width, col, row, rgb, alpha, height);
      }
    }
  }
}

function fillEllipse(
  pixels: Buffer,
  width: number,
  height: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  color: string,
  alpha = 1
) {
  const rgb = hexToRgb(color);
  for (let row = cy - ry; row <= cy + ry; row += 1) {
    for (let col = cx - rx; col <= cx + rx; col += 1) {
      const normalized =
        ((col - cx) * (col - cx)) / (rx * rx) +
        ((row - cy) * (row - cy)) / (ry * ry);
      if (normalized <= 1) {
        setPixel(pixels, width, col, row, rgb, alpha, height);
      }
    }
  }
}

function drawSmile(
  pixels: Buffer,
  width: number,
  height: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string
) {
  const rgb = hexToRgb(color);
  for (let x = x1; x <= x2; x += 1) {
    const t = (x - x1) / Math.max(x2 - x1, 1);
    const y = y1 + Math.round(Math.sin(t * Math.PI) * 20);
    fillCircleAtRgb(pixels, width, height, x, y, 5, rgb);
  }
}

function drawTextBlocks(
  pixels: Buffer,
  width: number,
  height: number,
  title: string,
  subtitle: string
) {
  const titleBlocks = Math.min([...title].length, 8);
  const subtitleBlocks = Math.min([...subtitle].length, 8);
  const color = hexToRgb("#3C3C43");
  const muted = hexToRgb("#6E7280");
  drawBlockRow(pixels, width, height, 256, 424, titleBlocks, 18, color);
  drawBlockRow(pixels, width, height, 256, 462, subtitleBlocks, 12, muted);
}

function drawBlockRow(
  pixels: Buffer,
  width: number,
  height: number,
  centerX: number,
  y: number,
  count: number,
  size: number,
  rgb: [number, number, number]
) {
  if (count <= 0) {
    return;
  }
  const gap = Math.round(size * 0.45);
  const total = count * size + (count - 1) * gap;
  let x = centerX - Math.floor(total / 2);
  for (let index = 0; index < count; index += 1) {
    for (let row = y; row < y + size; row += 1) {
      for (let col = x; col < x + size; col += 1) {
        setPixel(pixels, width, col, row, rgb, 1, height);
      }
    }
    x += size + gap;
  }
}

function fillCircleAtRgb(
  pixels: Buffer,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  rgb: [number, number, number]
) {
  for (let row = cy - radius; row <= cy + radius; row += 1) {
    for (let col = cx - radius; col <= cx + radius; col += 1) {
      const dx = col - cx;
      const dy = row - cy;
      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(pixels, width, col, row, rgb, 1, height);
      }
    }
  }
}

function setPixel(
  pixels: Buffer,
  width: number,
  x: number,
  y: number,
  rgb: [number, number, number],
  alpha = 1,
  height = Number.MAX_SAFE_INTEGER
) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return;
  }
  const offset = (y * width + x) * 4;
  const existingAlpha = pixels[offset + 3] / 255;
  const nextAlpha = alpha + existingAlpha * (1 - alpha);
  for (let channel = 0; channel < 3; channel += 1) {
    const current = pixels[offset + channel];
    pixels[offset + channel] = Math.round(
      (rgb[channel] * alpha + current * existingAlpha * (1 - alpha)) /
        Math.max(nextAlpha, 0.001)
    );
  }
  pixels[offset + 3] = Math.round(nextAlpha * 255);
}

function hexToRgb(color: string): [number, number, number] {
  const hex = color.replace("#", "");
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16)
  ];
}

function encodePng(width: number, height: number, rgba: Buffer) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let row = 0; row < height; row += 1) {
    const rawOffset = row * (stride + 1);
    raw[rawOffset] = 0;
    rgba.copy(raw, rawOffset + 1, row * stride, (row + 1) * stride);
  }

  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
  ]);
  return Buffer.concat([
    signature,
    pngChunk("IHDR", createIhdr(width, height)),
    pngChunk("IDAT", zlib.deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function createIhdr(width: number, height: number) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return ihdr;
}

function pngChunk(type: string, data: Buffer) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.byteLength, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
