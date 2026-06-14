import fs from "node:fs";
import path from "node:path";

export interface AvatarApiConfig {
  port: number;
  host: string;
  publicBaseUrl: string;
  dataDir: string;
  providerMode: "auto" | "mock" | "real";
  mockOnProviderFailure: boolean;
  apimartApiKey: string;
  apimartBaseUrl: string;
  apimartResolution: "1k" | "2k" | "4k";
  apimartPollIntervalMs: number;
  apimartPollTimeoutMs: number;
  tripoApiKey: string;
  tripoBaseUrl: string;
  tripoModelVersion: string;
  tripoRigVersion: string;
  tripoPollIntervalMs: number;
  tripoPollTimeoutMs: number;
}

function intEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function boolEnv(name: string, fallback: boolean) {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
}

function oneOf<T extends string>(value: string | undefined, allowed: T[], fallback: T) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function loadConfig(): AvatarApiConfig {
  const serviceRoot = resolveServiceRoot();
  loadEnvFiles(serviceRoot);

  const port = intEnv("AVATAR_API_PORT", 4317);
  const host = process.env.AVATAR_API_HOST ?? "127.0.0.1";
  const publicBaseUrl =
    process.env.AVATAR_API_PUBLIC_BASE_URL ?? `http://${host}:${port}`;

  return {
    port,
    host,
    publicBaseUrl,
    dataDir:
      process.env.AVATAR_API_DATA_DIR ?? path.join(serviceRoot, ".data"),
    providerMode: oneOf(
      process.env.AVATAR_PROVIDER_MODE,
      ["auto", "mock", "real"],
      "auto"
    ),
    mockOnProviderFailure: boolEnv("AVATAR_MOCK_ON_PROVIDER_FAILURE", true),
    apimartApiKey: process.env.APIMART_API_KEY ?? "",
    apimartBaseUrl: process.env.APIMART_BASE_URL ?? "https://api.apimart.ai/v1",
    apimartResolution: oneOf(
      process.env.APIMART_GPT_IMAGE_2_RESOLUTION,
      ["1k", "2k", "4k"],
      "1k"
    ),
    apimartPollIntervalMs: intEnv("APIMART_POLL_INTERVAL_MS", 3000),
    apimartPollTimeoutMs: intEnv("APIMART_POLL_TIMEOUT_MS", 600000),
    tripoApiKey: process.env.TRIPO_API_KEY ?? "",
    tripoBaseUrl: process.env.TRIPO_BASE_URL ?? "https://api.tripo3d.ai",
    tripoModelVersion: process.env.TRIPO_MODEL_VERSION ?? "P1-20260311",
    tripoRigVersion: process.env.TRIPO_RIG_VERSION ?? "v2.5-20260210",
    tripoPollIntervalMs: intEnv("TRIPO_POLL_INTERVAL_MS", 2500),
    tripoPollTimeoutMs: intEnv("TRIPO_POLL_TIMEOUT_MS", 900000)
  };
}

function resolveServiceRoot() {
  const cwd = process.cwd();
  if (
    path.basename(cwd) === "avatar-api" &&
    path.basename(path.dirname(cwd)) === "services"
  ) {
    return cwd;
  }
  return path.join(cwd, "services", "avatar-api");
}

function loadEnvFiles(serviceRoot: string) {
  const repoRoot = path.dirname(path.dirname(serviceRoot));
  loadEnvFile(path.join(repoRoot, ".env"));
  loadEnvFile(path.join(serviceRoot, ".env"));
}

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = stripEnvQuotes(trimmed.slice(separatorIndex + 1).trim());
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function stripEnvQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
