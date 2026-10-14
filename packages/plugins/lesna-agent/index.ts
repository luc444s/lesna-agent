import { Plugin } from "@opencode/plugin"
import { registerMcps } from "./mcp"
import { registerProfile } from "./profile"
import { buildSkills } from "./skills"
import { mostrarImagen } from "./tools/imagen"

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

    await ctx.tool.transform((editor) => {
      editor.namespace({
        name: "lesna",
        description: "Herramientas de Lesna Agent",
      })
      editor.add({
        ...mostrarImagen,
        name: "mostrar_imagen",
        // codemode:false saca la tool del runtime restringido de Code Mode.
        // Invocada desde ahi llega como `execute` y el chat no la pinta; como
        // tool de primer nivel usa el renderer normal, que ya sabe mostrar los
        // Tool.FileContent.
        options: { namespace: "lesna", codemode: false },
      })
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
