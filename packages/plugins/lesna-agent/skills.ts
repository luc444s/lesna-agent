import { Skill } from "@opencode/plugin"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import source from "./skills-source.json" with { type: "json" }

/** Reads the bundled skills and returns their definitions. */
export async function buildSkills() {
  const directory = new URL("./skills/", import.meta.url)
  return Promise.all(
    source.skills.map(async (name) => {
      const file = new URL(`${name}/SKILL.md`, directory)
      const markdown = matter(await readFile(file, "utf8"))
      return Skill.Info.make({
        id: Skill.ID.make(name),
        name: Skill.Name.make(markdown.data.name),
        description: markdown.data.description,
        autoinvoke: markdown.data["disable-model-invocation"] !== true,
        path: Skill.Info.fields.path.make(fileURLToPath(file)),
        content: markdown.content,
      })
    }),
  )
}