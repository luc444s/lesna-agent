import { existsSync } from "node:fs"
import { homedir } from "node:os"
import { delimiter, join } from "node:path"
import { Mcp, Plugin } from "@opencode/plugin"
import { readSecrets } from "./secrets"

type Context = Parameters<Parameters<typeof Plugin.define>[0]["setup"]>[0]
type McpEditor = Parameters<Parameters<Context["mcp"]["transform"]>[0]>[0]
type ServerConfig = Mcp.ServerConfig

/**
 * Orchestrator checkout that ships the MCP servers. Everything under
 * `runtime/mcps/` is gitignored, so those entries are skipped when absent.
 * Override with LESNA_ORCHESTRATOR_ROOT to relocate the checkout.
 */
const orchestrator =
  process.env.LESNA_ORCHESTRATOR_ROOT ??
  join(homedir(), "Proyectos", "orquestador_ardi", "ORQUESTADOR-ARDI-MIGRATION")

/** OpenCode data dir. The OpenClaw `OPENCLAW_*` paths are reassigned here. */
const dataDir = join(homedir(), ".local", "share", "opencode")
const mediaDir = join(dataDir, "media")

/** Secrets stay on disk and are only ever passed through to the server process. */
const secretsFile = join(homedir(), ".local", "share", "systutor", "secrets.env")

interface Spec {
  command: string[]
  cwd?: string
  environment?: Record<string, string>
  /** Secrets without which the server cannot start. */
  required?: string[]
  /** Secrets forwarded when present. */
  optional?: string[]
}

interface Resolved {
  config: ServerConfig
  reason?: string
}

/** Registers the orchestrator MCP servers, skipping any the user already configured. */
export function registerMcps(editor: McpEditor) {
  const secrets = readSecrets(secretsFile)
  for (const name of ["blender", "after-effects", "seedance", "trellis", "engram"]) {
    if (editor.get(name)) continue
    const resolved = build(specs[name](), secrets)
    editor.set(name, resolved.config)
    if (resolved.reason) console.info(`[lesna-agent] mcp ${name} disabled: ${resolved.reason}`)
  }
}

const specs: Record<string, () => Spec> = {
  blender: () => {
    const cwd = join(orchestrator, "runtime", "mcps", "blender")
    return { command: [join(cwd, "bin", "mcp-for-blender")], cwd }
  },
  "after-effects": () => {
    const cwd = join(orchestrator, "runtime", "mcps", "after-effects-mcp")
    return { command: [node(), join(cwd, "build", "index.js")], cwd }
  },
  seedance: () => ({
    command: [node(), join(orchestrator, "plugins", "seedance", "scripts", "seedance-mcp.mjs")],
    environment: {
      OPENCLAW_MEDIA_DIR: mediaDir,
      SEEDANCE_STATE_DIR: join(dataDir, "state", "seedance"),
    },
    required: ["SEEDANCE_API_KEY"],
    optional: [
      "SEEDANCE_BASE_URL",
      "R2_ENABLED",
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET",
      "R2_PUBLIC_URL",
      "TRELLIS_BASE_URL",
      "TRELLIS_MODEL",
    ],
  }),
  trellis: () => ({
    command: [python(), join(orchestrator, "plugins", "3d_rendering", "mcp", "server.py")],
    environment: {
      OPENCLAW_STATE_DIR: dataDir,
      OPENCLAW_MEDIA_DIR: mediaDir,
    },
  }),
  engram: () => ({
    command: [requireBin("engram"), "mcp", "--tools=agent", "--project", "lesna.ai"],
  }),
}

function build(spec: Spec, secrets: Record<string, string>): Resolved {
  const environment: Record<string, string> = { ...spec.environment }
  const missing: string[] = []

  const executable = spec.command[0]
  if (!executable || !existsSync(executable)) missing.push(`executable not found: ${executable ?? "none"}`)

  for (const key of spec.required ?? []) {
    const value = secret(key, secrets)
    if (value === undefined) missing.push(`missing ${key} in ${secretsFile}`)
    else environment[key] = value
  }

  for (const key of spec.optional ?? []) {
    const value = secret(key, secrets)
    if (value !== undefined) environment[key] = value
  }

  const config: ServerConfig = {
    type: "local",
    command: spec.command,
    ...(spec.cwd ? { cwd: spec.cwd } : {}),
    ...(Object.keys(environment).length ? { environment } : {}),
    ...(missing.length ? { disabled: true } : {}),
  }
  return missing.length ? { config, reason: missing.join("; ") } : { config }
}

/** Secrets come from the secrets file first, then the ambient environment. */
function secret(key: string, secrets: Record<string, string>) {
  const value = secrets[key] ?? process.env[key]
  return value && value.trim() ? value : undefined
}

/** Resolves a binary on PATH, falling back to a bare name so the spawn error names it. */
function requireBin(name: string) {
  return which(name) ?? name
}

function node() {
  return requireBin("node")
}

function python() {
  return which("python3.14") ?? which("python3") ?? "python3"
}

function which(name: string) {
  for (const dir of (process.env.PATH ?? "").split(delimiter)) {
    if (!dir) continue
    const candidate = join(dir, name)
    if (existsSync(candidate)) return candidate
  }
  return undefined
}
