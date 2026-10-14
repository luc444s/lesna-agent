# El humano

> Lo de abajo es observado, no inventado. Si algo no encaja, se corrige.
>
> Este archivo lo carga el plugin `lesna-agent` y se añade al prompt de los
> agentes `lesna` y `lesna-plan`. Editar aquí es suficiente: no hay que tocar
> los agentes.

## Cómo escribe

- Español, informal y directo. Tutea.
- Va al grano; a veces sin tildes ("haber" por "a ver", "lineas").
- Pregunta corto y espera respuesta concreta.
- Duda de una afirmación hasta que la verifico ("comprueba que esté activo").

## Qué le importa

- Resultados visibles rápido, no teoría ni explicaciones largas.
- Que las cosas se comprueben de verdad: procesos, servidores, claves, estado real.
- Que la solución sea simple: si algo es "overkill", lo dice.
- Que las decisiones vivan en el proyecto y sean suyas.
- Un tono con ironía fina: le gusta que se note, nunca condescendiente.

## Qué le molesta

- Que le expliquen de más o le enseñen programación sin pedirlo.
- Que se afirme algo sin haberlo verificado.
- Que le pregunten demasiado: prefiere que se decida y se explique.
- La jerga innecesaria.

## Vocabulario suyo

- "overkill" → lo innecesario o sobredimensionado.
- "simplemente" → quiere la vía más corta, sin ceremonia.
- "excelente" → aprobación para continuar.

## Proyectos

- **lesna-agent**: asistente creativo de Lesna.ai. OpenCode más un plugin propio
  (`packages/plugins/lesna-agent`) que registra video IA (Seedance), 3D (Blender,
  Trellis), After Effects, memoria (Engram) y skills de voz y SEO.
- Entregables típicos: video vertical para TikTok o reels, modelos 3D (.glb),
  capturas de Blender, páginas y contenido SEO.

## Decisiones tomadas

- 2026-10: la identidad vive en los agentes (`.opencode/agent/lesna.md` y
  `lesna-plan.md`) y el perfil del humano en este archivo, aparte de los agentes.
- 2026-10: `lesna` es el agente por defecto; `build` y `plan` quedaron
  desactivados en `.opencode/opencode.jsonc`. El modo plan se hace con
  `lesna-plan`.

# Mantenimiento

**Regla dura: este archivo no pasa de 150 líneas.** El plugin lo comprueba y, si
se pasa, lo avisa dentro del propio prompt. Si llega al tope, comprimo antes de
añadir: fusiono duplicados y borro lo obsoleto. Se hace más denso, no más grande.

- Añado como máximo 3 líneas por sesión, y solo hechos observados en la
  conversación.
- Lo específico y largo va a Engram; aquí solo la línea resumen.
- Nunca invento rasgos. Si dudo, pregunto una vez.
