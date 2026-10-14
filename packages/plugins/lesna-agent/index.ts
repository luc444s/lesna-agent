import { Plugin } from "@opencode/plugin"
import { registerMcps } from "./mcp"
import { registerProfile } from "./profile"
import { buildSkills } from "./skills"

const instruction = `Act as Lesna Agent: an orchestration-focused coding partner for Lesna.ai.
Prioritize concrete execution, concise planning, preserving user work, and making changes that can be verified.`

export default Plugin.define({
  id: "lesna.agent",
  async setup(ctx) {
    await ctx.command.transform((editor) => {
      editor.add({
        name: "lesna-agent",
        description: "Run the current request through the Lesna Agent orchestration persona",
        execute: async ({ sessionID, prompt, delivery }) => {
          await ctx.session.prompt({
            ...prompt,
            sessionID,
            text: `${instruction}\n\nUser request:\n${prompt.text}`,
            delivery,
          })
        },
      })
    })

    await ctx.mcp.transform((editor) => {
      registerMcps(editor)
    })

    await registerProfile(ctx)

    const skills = await buildSkills()
    await ctx.skill.transform((editor) => {
      skills.forEach((skill) => {
        if (!editor.get(skill.id)) editor.add(skill)
      })
    })
  },
})
