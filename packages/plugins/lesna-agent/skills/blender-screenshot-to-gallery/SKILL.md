---
name: "blender-screenshot-to-gallery"
description: "Captura de pantalla o render de Blender a la galería — hacer la captura, exportarla a ~/gallery-inbox/ y confirmar que aparece en /app/gallery."
---

# Captura de Blender a la galería

Usa esta skill cuando la persona pida guardar en la galería una captura de
Blender, una vista previa del viewport, un render, o "lo que se ve ahora mismo en
Blender". También cuando pida ver cómo queda un modelo.

No hay que llamar a la API ni subir nada. Se copia el fichero a la carpeta
vigilada y un watcher del backend lo archiva solo.

## Antes de nada: abrir Blender

Blender es una app de escritorio. Si no está ya abierto, **no lo abras tú**: se
abre en la sesión gráfica de la persona, y desde aquí no se ve. Dile que abra
Blender y que modele, y vuelve cuando haya algo que capturar.

Si Blender está abierto, el MCP de Blender (`execute_blender_code` y compañía)
puede ejecutar Python dentro de él. Usa ese camino: es la única forma fiable de
leer la escena real en vez de suponerla.

## Decide qué es la captura

| Lo que pide | Qué haces |
|---|---|
| "captura de pantalla", "lo que veo" | Captura del viewport, tal cual se ve |
| "render", "bien bonito", "final" | `bpy.ops.render.render(write_still=True)` |
| "vista previa", "mira cómo queda" | Viewport, es más rápido |

Por defecto, **viewport**. Renderizar cuesta tiempo y la persona quiere ver algo
ya; renderiza solo si lo pide o si hay que entregar la versión buena.

## Haz la captura

**Viewport** — captura la ventana de Blender con la herramienta del sistema y
guarda el resultado. Guarda el PNG en una ruta temporal y anota cuál es.

**Render** — dentro de Blender, por el MCP:

```python
import os
out_dir = os.path.expanduser("~/gallery-inbox")
os.makedirs(out_dir, exist_ok=True)

scene = bpy.context.scene
scene.render.filepath = os.path.join(out_dir, "captura.png")
scene.render.image_settings.file_format = "PNG"
bpy.ops.render.render(write_still=True)
```

`scene.render.filepath` va con la extensión incluida, o Blender añade otra por
encima y el fichero sale como `captura.png0001.png`.

## Entrégala en la galería

1. Copia el PNG a `~/gallery-inbox/`. Si el render ya se escribió ahí, no hace
   falta copiarlo.
2. Ponle un nombre que signifique algo: `desierto-oasis-captura.png`. Nunca
   `render.png`, `captura1.png` ni `output.png` — en la galería se ve la lista y
   un nombre mudo no ayuda.
3. Un watcher del backend lo archiva en `/app/gallery` en unos segundos. No
   llames a la API, no subas nada, no esperes confirmación del backend.
4. Dile a la persona que ya está en la galería y en qué ruta.

## Lo que NO es un entregable

- **El `.blend` no se ve en la galería.** Es el fichero de trabajo: la galería lo
  guarda, pero el navegador no lo abre. Solo sirven `.png`, `.mp4`, `.glb`, `.jpg`.
  Si pides "guárdame el modelo", eso es un `.glb` y es otro camino (ver el
  MCP `trellis`).
- **No borres el `.blend`.** Se queda como fichero de trabajo; la galería guarda
  su propia copia.
- **No vacíes `~/gallery-inbox/`.** Los ficheros se quedan ahí a propósito. El
  watcher re-hasea los mismos en cada arranque, pero no duplica assets.

## Si la imagen no aparece

- El watcher corre dentro del backend. Si la app está cerrada, no archiva nada:
  se archivará al abrirla.
- Solo `.png`, `.jpg`, `.mp4`, `.glb`, `.wav`, `.pdf`, `.txt` y similares entran.
  Un `.blend` o un `.fbx` se ignora en silencio, sin error.
- Espera unos segundos: el watcher sondea por intervalo, no está leyendo cambios.
