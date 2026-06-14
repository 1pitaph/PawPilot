import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import type {
  AvatarAsset,
  AvatarGenerationJob,
  AvatarPipelineStage
} from "@pets/shared";

export interface UploadedFile {
  id: string;
  fileName: string;
  mimeType: string;
  url: string;
  path?: string;
  sizeBytes?: number;
  sha256?: string;
  createdAt: string;
}

export interface AvatarJobEvent {
  id: string;
  jobId: string;
  seq: number;
  eventType: AvatarPipelineStage | "asset_ready" | "message";
  payload: Record<string, unknown>;
  createdAt: string;
}

interface PersistedState {
  uploads: UploadedFile[];
  jobs: AvatarGenerationJob[];
  events: AvatarJobEvent[];
}

export class AvatarStore {
  private state: PersistedState = { uploads: [], jobs: [], events: [] };
  private listeners = new Map<string, Set<(event: AvatarJobEvent) => void>>();
  private readonly statePath: string;
  readonly assetsDir: string;

  constructor(
    private readonly dataDir: string,
    private readonly publicBaseUrl: string
  ) {
    this.assetsDir = path.join(dataDir, "assets");
    this.statePath = path.join(dataDir, "avatar-store.json");
  }

  async init() {
    await fs.mkdir(this.assetsDir, { recursive: true });
    try {
      const raw = await fs.readFile(this.statePath, "utf8");
      this.state = JSON.parse(raw) as PersistedState;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
      await this.save();
    }
  }

  listJobs() {
    return [...this.state.jobs].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt)
    );
  }

  getJob(jobId: string) {
    return this.state.jobs.find((job) => job.id === jobId);
  }

  async upsertJob(job: AvatarGenerationJob) {
    const index = this.state.jobs.findIndex((item) => item.id === job.id);
    if (index >= 0) {
      this.state.jobs[index] = job;
    } else {
      this.state.jobs.push(job);
    }
    await this.save();
  }

  getUpload(fileId: string) {
    return this.state.uploads.find((file) => file.id === fileId);
  }

  async saveUpload(input: {
    fileName: string;
    mimeType: string;
    bytes?: Buffer;
    remoteUrl?: string;
  }) {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    let storedPath: string | undefined;
    let sizeBytes: number | undefined;
    let sha256: string | undefined;
    let url = input.remoteUrl ?? "";

    if (input.bytes) {
      const safeName = safeFileName(input.fileName || "pet-photo.bin");
      const fileName = `${id}-${safeName}`;
      storedPath = path.join(this.assetsDir, fileName);
      await fs.writeFile(storedPath, input.bytes);
      sizeBytes = input.bytes.byteLength;
      sha256 = crypto.createHash("sha256").update(input.bytes).digest("hex");
      url = this.assetUrl(fileName);
    }

    const upload: UploadedFile = {
      id,
      fileName: input.fileName,
      mimeType: input.mimeType,
      url,
      path: storedPath,
      sizeBytes,
      sha256,
      createdAt
    };
    this.state.uploads.push(upload);
    await this.save();
    return upload;
  }

  async saveAssetFile(input: {
    fileName: string;
    mimeType: string;
    bytes: Buffer | string;
  }) {
    const fileName = `${crypto.randomUUID()}-${safeFileName(input.fileName)}`;
    const bytes =
      typeof input.bytes === "string" ? Buffer.from(input.bytes) : input.bytes;
    const storedPath = path.join(this.assetsDir, fileName);
    await fs.writeFile(storedPath, bytes);
    return {
      url: this.assetUrl(fileName),
      sizeBytes: bytes.byteLength,
      sha256: crypto.createHash("sha256").update(bytes).digest("hex")
    };
  }

  async archiveRemoteAsset(remoteUrl: string, fallbackFileName: string) {
    if (remoteUrl.startsWith("data:")) {
      return this.archiveDataUrl(remoteUrl, fallbackFileName);
    }

    const response = await fetch(remoteUrl);
    if (!response.ok) {
      throw new Error(`archive remote asset failed: ${response.status}`);
    }

    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream";
    const arrayBuffer = await response.arrayBuffer();
    const extension = extensionFromMime(contentType) || path.extname(fallbackFileName);
    return this.saveAssetFile({
      fileName: withExtension(fallbackFileName, extension),
      mimeType: contentType,
      bytes: Buffer.from(arrayBuffer)
    });
  }

  async appendEvent(
    jobId: string,
    eventType: AvatarJobEvent["eventType"],
    payload: Record<string, unknown>
  ) {
    const seq =
      this.state.events.filter((event) => event.jobId === jobId).length + 1;
    const event: AvatarJobEvent = {
      id: crypto.randomUUID(),
      jobId,
      seq,
      eventType,
      payload,
      createdAt: new Date().toISOString()
    };
    this.state.events.push(event);
    await this.save();

    for (const listener of this.listeners.get(jobId) ?? []) {
      listener(event);
    }
    return event;
  }

  listEvents(jobId: string) {
    return this.state.events
      .filter((event) => event.jobId === jobId)
      .sort((left, right) => left.seq - right.seq);
  }

  subscribe(jobId: string, listener: (event: AvatarJobEvent) => void) {
    const set = this.listeners.get(jobId) ?? new Set();
    set.add(listener);
    this.listeners.set(jobId, set);

    return () => {
      set.delete(listener);
      if (set.size === 0) {
        this.listeners.delete(jobId);
      }
    };
  }

  makeAsset(input: Omit<AvatarAsset, "id" | "createdAt" | "status"> & {
    status?: AvatarAsset["status"];
  }): AvatarAsset {
    return {
      id: crypto.randomUUID(),
      status: input.status ?? "ready",
      createdAt: new Date().toISOString(),
      ...input
    };
  }

  private async archiveDataUrl(dataUrl: string, fallbackFileName: string) {
    const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(dataUrl);
    if (!match) {
      throw new Error("invalid data url");
    }

    const mimeType = match[1] || "application/octet-stream";
    const isBase64 = Boolean(match[2]);
    const payload = match[3] ?? "";
    const bytes = isBase64
      ? Buffer.from(payload, "base64")
      : Buffer.from(decodeURIComponent(payload));

    return this.saveAssetFile({
      fileName: withExtension(fallbackFileName, extensionFromMime(mimeType)),
      mimeType,
      bytes
    });
  }

  private assetUrl(fileName: string) {
    return `${this.publicBaseUrl.replace(/\/$/, "")}/assets/${fileName}`;
  }

  private async save() {
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.writeFile(this.statePath, JSON.stringify(this.state, null, 2));
  }
}

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120);
}

function withExtension(fileName: string, extension?: string) {
  if (!extension) {
    return fileName;
  }
  const normalized = extension.startsWith(".") ? extension : `.${extension}`;
  return path.extname(fileName) ? fileName : `${fileName}${normalized}`;
}

function extensionFromMime(mimeType: string) {
  if (mimeType.includes("svg")) {
    return ".svg";
  }
  if (mimeType.includes("png")) {
    return ".png";
  }
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
    return ".jpg";
  }
  if (mimeType.includes("webp")) {
    return ".webp";
  }
  if (mimeType.includes("gltf-binary") || mimeType.includes("glb")) {
    return ".glb";
  }
  if (mimeType.includes("json")) {
    return ".json";
  }
  return "";
}
