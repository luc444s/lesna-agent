import { readFileSync } from "node:fs"

export type Secrets = Record<string, string>

/**
 * Parses a `KEY=value` secrets file. Unreadable or missing files yield an empty
 * record so callers can degrade instead of crashing. Only names are ever
 * consumed here: values stay on disk and are handed straight to the server
 * process environment.
 */
export function readSecrets(path: string): Secrets {
  let content: string
  try {
    content = readFileSync(path, "utf8")
  } catch {
    return {}
  }

  const values: Secrets = {}
  for (const line of content.split("\n")) {
    const entry = line.trim()
    if (!entry || entry.startsWith("#")) continue
    const separator = entry.indexOf("=")
    if (separator === -1) continue
    const key = entry.slice(0, separator).trim()
    if (!key) continue
    values[key] = unquote(entry.slice(separator + 1).trim())
  }
  return values
}

function unquote(value: string) {
  const quote = value[0]
  if (value.length < 2) return value
  if ((quote === '"' || quote === "'") && value.endsWith(quote)) return value.slice(1, -1)
  return value
}
