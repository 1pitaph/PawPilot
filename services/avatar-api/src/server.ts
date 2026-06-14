import fs from "node:fs";
import http, { type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";

import type {
  CreateAvatarJobRequest,
  SelectAvatarCandidateRequest
} from "@pets/shared";

import { loadConfig } from "./config.js";
import { AvatarPipeline } from "./pipeline.js";
import { buildProviders } from "./providers.js";
import { AvatarStore } from "./store.js";

const config = loadConfig();
const store = new AvatarStore(config.dataDir, config.publicBaseUrl);
await store.init();

const providers = buildProviders(config);
const pipeline = new AvatarPipeline(
  config,
  store,
  providers.imageProvider,
  providers.tripoProvider
);

const server = http.createServer((request, response) => {
  void route(request, response).catch((error) => {
    sendJson(response, 500, {
      code: 500,
      message: error instanceof Error ? error.message : String(error),
      data: null
    });
  });
});

server.listen(config.port, config.host, () => {
  console.log(
    `[avatar-api] listening on ${config.publicBaseUrl} providers=image:${providers.imageProvider.name} tripo:${providers.tripoProvider.name}`
  );
});

async function route(request: IncomingMessage, response: ServerResponse) {
  setCors(response);
  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url ?? "/", config.publicBaseUrl);
  const pathname = decodeURIComponent(url.pathname);

  if (request.method === "GET" && pathname === "/health") {
    sendJson(response, 200, {
      code: 0,
      message: "success",
      data: {
        ok: true,
        providers: {
          image: providers.imageProvider.name,
          tripo: providers.tripoProvider.name
        }
      }
    });
    return;
  }

  if (request.method === "GET" && pathname.startsWith("/assets/")) {
    await sendAsset(pathname, response);
    return;
  }

  if (request.method === "POST" && pathname === "/agent-api/v1/upload") {
    const body = await readJson<UploadBody>(request);
    const upload = await store.saveUpload({
      fileName: body.fileName || "pet-photo.png",
      mimeType: body.mimeType || "image/png",
      bytes: decodeUploadBytes(body),
      remoteUrl: body.remoteUrl
    });
    sendJson(response, 200, {
      code: 0,
      message: "success",
      data: {
        fileId: upload.id,
        cosUrl: upload.url,
        url: upload.url,
        fileName: upload.fileName,
        mimeType: upload.mimeType
      }
    });
    return;
  }

  if (request.method === "GET" && pathname === "/agent-api/v1/avatar/jobs") {
    sendJson(response, 200, {
      code: 0,
      message: "success",
      data: {
        jobs: store.listJobs()
      }
    });
    return;
  }

  const createJobMatch = /^\/agent-api\/v1\/pets\/([^/]+)\/avatar\/jobs$/.exec(
    pathname
  );
  if (request.method === "POST" && createJobMatch) {
    const body = await readJson<Omit<CreateAvatarJobRequest, "petId">>(request);
    const job = await pipeline.createJob({
      ...body,
      petId: createJobMatch[1]
    });
    sendJson(response, 202, {
      code: 0,
      message: "accepted",
      data: { job }
    });
    return;
  }

  const currentAvatarMatch = /^\/agent-api\/v1\/pets\/([^/]+)\/avatar$/.exec(
    pathname
  );
  if (request.method === "GET" && currentAvatarMatch) {
    const petId = currentAvatarMatch[1];
    const job = store
      .listJobs()
      .find(
        (item) =>
          item.petId === petId &&
          (item.status === "ready" || item.status === "degraded")
      );
    sendJson(response, 200, {
      code: 0,
      message: "success",
      data: { avatar: job ?? null }
    });
    return;
  }

  const jobEventsMatch = /^\/agent-api\/v1\/avatar\/jobs\/([^/]+)\/events$/.exec(
    pathname
  );
  if (request.method === "GET" && jobEventsMatch) {
    sendEvents(jobEventsMatch[1], request, response);
    return;
  }

  const selectMatch =
    /^\/agent-api\/v1\/avatar\/jobs\/([^/]+)\/select-q$/.exec(pathname);
  if (request.method === "POST" && selectMatch) {
    const body = await readJson<SelectAvatarCandidateRequest>(request);
    const job = await pipeline.selectCandidate(
      selectMatch[1],
      body.selectedQAssetId
    );
    sendJson(response, 200, {
      code: 0,
      message: "success",
      data: { job }
    });
    return;
  }

  const retryMatch = /^\/agent-api\/v1\/avatar\/jobs\/([^/]+)\/retry$/.exec(
    pathname
  );
  if (request.method === "POST" && retryMatch) {
    const job = await pipeline.retryJob(retryMatch[1]);
    sendJson(response, 200, {
      code: 0,
      message: "success",
      data: { job }
    });
    return;
  }

  const jobMatch = /^\/agent-api\/v1\/avatar\/jobs\/([^/]+)$/.exec(pathname);
  if (jobMatch) {
    if (request.method === "GET") {
      const job = store.getJob(jobMatch[1]);
      if (!job) {
        sendJson(response, 404, {
          code: 404,
          message: "job not found",
          data: null
        });
        return;
      }
      sendJson(response, 200, {
        code: 0,
        message: "success",
        data: { job }
      });
      return;
    }

    if (request.method === "DELETE") {
      const job = await pipeline.cancelJob(jobMatch[1]);
      sendJson(response, 200, {
        code: 0,
        message: "success",
        data: { job }
      });
      return;
    }
  }

  sendJson(response, 404, {
    code: 404,
    message: "not found",
    data: null
  });
}

function sendEvents(
  jobId: string,
  request: IncomingMessage,
  response: ServerResponse
) {
  if (!store.getJob(jobId)) {
    sendJson(response, 404, {
      code: 404,
      message: "job not found",
      data: null
    });
    return;
  }

  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream"
  });

  for (const event of store.listEvents(jobId)) {
    response.write(`id: ${event.seq}\n`);
    response.write(`event: ${event.eventType}\n`);
    response.write(`data: ${JSON.stringify(event)}\n\n`);
  }

  const interval = setInterval(() => {
    response.write(`: heartbeat ${Date.now()}\n\n`);
  }, 15000);

  const unsubscribe = store.subscribe(jobId, (event) => {
    response.write(`id: ${event.seq}\n`);
    response.write(`event: ${event.eventType}\n`);
    response.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  request.on("close", () => {
    clearInterval(interval);
    unsubscribe();
  });
}

async function sendAsset(pathname: string, response: ServerResponse) {
  const fileName = path.basename(pathname);
  const filePath = path.join(store.assetsDir, fileName);
  if (!filePath.startsWith(store.assetsDir)) {
    sendJson(response, 400, {
      code: 400,
      message: "invalid asset path",
      data: null
    });
    return;
  }

  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch {
    sendJson(response, 404, {
      code: 404,
      message: "asset not found",
      data: null
    });
    return;
  }

  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Type": contentType(fileName)
  });
  fs.createReadStream(filePath).pipe(response);
}

async function readJson<T>(request: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.byteLength;
    if (total > 20 * 1024 * 1024) {
      throw new Error("request body too large");
    }
    chunks.push(buffer);
  }

  if (chunks.length === 0) {
    return {} as T;
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as T;
}

function sendJson(
  response: ServerResponse,
  statusCode: number,
  body: Record<string, unknown>
) {
  setCors(response);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(body));
}

function setCors(response: ServerResponse) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

interface UploadBody {
  fileName?: string;
  mimeType?: string;
  dataUrl?: string;
  base64?: string;
  remoteUrl?: string;
}

function decodeUploadBytes(body: UploadBody) {
  if (body.dataUrl) {
    const match = /^data:[^;,]+?;base64,(.*)$/s.exec(body.dataUrl);
    if (!match) {
      throw new Error("invalid dataUrl");
    }
    return Buffer.from(match[1], "base64");
  }
  if (body.base64) {
    return Buffer.from(body.base64, "base64");
  }
  return undefined;
}

function contentType(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".svg":
      return "image/svg+xml; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".glb":
      return "model/gltf-binary";
    case ".json":
      return "application/json; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}
