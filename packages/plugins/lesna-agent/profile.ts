import { Plugin } from "@opencode/plugin"

type Context = Parameters<Parameters<typeof Plugin.define>[0]["setup"]>[0]

/** Agents whose prompts get the human profile appended. */
const agents = new Set(["lesna", "lesna-plan"])

/** The profile is a summary, not an archive: past this it must be compressed. */
const limit = 150

const file = new URL("./profile.md", import.meta.url)

/**
 * Appends the human profile to the prompt of the Lesna agents. The profile is
 * read per request so editing it applies without restarting, and it lands after
 * the agent prompt so the stable prefix stays cacheable.
 */
export function registerProfile(ctx: Context) {
  return ctx.session.hook("context", async (event) => {
    if (!agents.has(event.agent)) return
    const text = await Bun.file(file).text()
    event.system.push({ type: "text", text: enforceBudget(text) })
  })
}

/**
 * States an over-budget profile in the prompt itself, so the next session
 * compresses it instead of growing it. The file stays intact: nothing is lost
 * silently, and the notice is impossible to miss.
 */
export function enforceBudget(text: string) {
  const lines = text.trimEnd().split("\n").length
  if (lines <= limit) return text
  return [
    text,
    "",
    `> Regla incumplida: este perfil tiene ${lines} líneas y su tope es ${limit}.`,
    "> Comprímelo antes de añadir nada: fusiona duplicados y borra lo obsoleto.",
    "> Lo específico y largo va a Engram; aquí solo la línea resumen.",
  ].join("\n")
}
