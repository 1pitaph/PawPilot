import type {
  AvatarGenerationJob,
  CreateAvatarJobRequest,
  SelectAvatarCandidateRequest
} from "@pets/shared";

const runtimeEnv = (
  globalThis as {
    process?: { env?: Record<string, string | undefined> };
  }
).process?.env;

export const AVATAR_API_BASE_URL =
  runtimeEnv?.EXPO_PUBLIC_AVATAR_API_URL ?? "http://127.0.0.1:4317";

interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

export async function createAvatarJob(
  petId: string,
  input: Omit<CreateAvatarJobRequest, "petId">
) {
  const body: Omit<CreateAvatarJobRequest, "petId"> = {
    candidateCount: 4,
    mode: "rigged_3d",
    tryRig: true,
    autoSelectFirstCandidate: false,
    geometryQuality: "standard",
    ...input
  };

  const envelope = await request<{ job: AvatarGenerationJob }>(
    `/agent-api/v1/pets/${encodeURIComponent(petId)}/avatar/jobs`,
    {
      body: JSON.stringify(body),
      method: "POST"
    }
  );
  return envelope.job;
}

export async function uploadAvatarSource(input: {
  base64: string;
  fileName: string;
  mimeType: string;
}) {
  const envelope = await request<{
    fileId: string;
    url: string;
    cosUrl: string;
    fileName: string;
    mimeType: string;
  }>("/agent-api/v1/upload", {
    body: JSON.stringify(input),
    method: "POST"
  });
  return envelope;
}

export async function fetchAvatarJob(jobId: string) {
  const envelope = await request<{ job: AvatarGenerationJob }>(
    `/agent-api/v1/avatar/jobs/${encodeURIComponent(jobId)}`
  );
  return envelope.job;
}

export async function selectAvatarCandidate(
  jobId: string,
  selectedQAssetId: string
) {
  const body: SelectAvatarCandidateRequest = { selectedQAssetId };
  const envelope = await request<{ job: AvatarGenerationJob }>(
    `/agent-api/v1/avatar/jobs/${encodeURIComponent(jobId)}/select-q`,
    {
      body: JSON.stringify(body),
      method: "POST"
    }
  );
  return envelope.job;
}

async function request<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${AVATAR_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers
    }
  });
  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || envelope.code !== 0) {
    throw new Error(envelope.message || `Avatar API ${response.status}`);
  }
  return envelope.data;
}

export function getAvatarApiErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
