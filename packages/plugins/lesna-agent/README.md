# Lesna Agent

An opt-in OpenCode plugin that adds the `lesna-agent` command. The command resubmits the current prompt with Lesna Agent's orchestration persona.

The plugin also registers Lesna's MCP servers and ships three of Lesna's own skills.

## Install

Install directly from Git:

```sh
opencode plugin add 'git+https://github.com/luc444s/lesna-agent.git#path:packages/plugins/lesna-agent'
```

For local development, add the directory to `plugins` in the project's `opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": ["./packages/plugins/lesna-agent"],
}
```

The plugin is not activated merely by being present in the repository. Installing it adds it to the user's configuration.

## Use

Run the `lesna-agent` command from OpenCode and include the task you want Lesna Agent to execute.

## MCP servers

On setup the plugin registers five MCP servers — `blender`, `after-effects`, `seedance`, `trellis` and `engram` — pointing at the orchestrator checkout. Servers you already configured yourself are never overwritten, and any whose executable or required secret is missing is registered as `disabled` with a reason logged to the console.

The checkout defaults to `~/Proyectos/orquestador_ardi/ORQUESTADOR-ARDI-MIGRATION`; override it with `LESNA_ORCHESTRATOR_ROOT`. Everything under `runtime/mcps/` is gitignored, so the servers stay unavailable until that checkout is populated.

Secrets are read from `~/.local/share/systutor/secrets.env` and from the environment. They are only ever passed through to the server process.

## Skills

Three of Lesna's own skills ship with the plugin:

| Skill | What it covers |
|---|---|
| `lesna-human-creative-guide` | Voice and identity for non-technical users: how to talk about Lesna's creative work without turning it into a class |
| `lesna-procedural-character` | Generating the low-poly humanoid character (skeleton + mesh + skin + walk cycle) from code and exporting the `.blend`/`.glb` |
| `blender-screenshot-to-gallery` | Capturing the Blender viewport or a render and handing the PNG to the gallery |

They are registered through `ctx.skill.transform`, so a skill of yours with the same id wins over the bundled one. The bundled set is listed in `skills-source.json`; adding a directory under `skills/` with a valid `SKILL.md` frontmatter and an entry there is all it takes to ship another one.
