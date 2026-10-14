---
name: "lesna-procedural-character"
description: "Personaje humanoide low-poly generado por codigo en Blender (esqueleto + malla + piel + caminata) y su .blend, reproducible. Usala cuando pidan un personaje base, un rig, un maniqui, o 'algo que camine' para animar o exportar."
---

# Personaje procedural low-poly

Usa esta skill cuando la persona pida un **personaje base**, un **esqueleto**,
un **maniqui**, un **rig para animar**, o "algo que camine", y sobre todo cuando
quiera un punto de partida reproducible en vez de modelar a mano.

No modeles a mano. El personaje es **codigo**: se genera entero (esqueleto,
malla, piel y caminata) desde el modulo `lesna_characters` dentro de Blender. El
`.blend` es la salida, no el origen.

## Que produce

- **Esqueleto contiguo** de 27 huesos: 22 de deformacion + `root` +
  4 conectores (`shoulder.L/R`, `pelvis.L/R`). Todo encadena con `use_connect`
  salvo `root`. Cadenas: `root > hips > spine_01..02 > chest > neck > head`,
  brazos `shoulder > clavicle > upper_arm > forearm > hand` y piernas
  `pelvis > thigh > shin > foot > toe`. Manos *mitten* (sin dedos, low-poly).
  Los conectores NO deforman: solo encadenan la rama sin mover la articulacion.
- **Malla proxy** low-poly (un cilindro por hueso deformante + cabeza) ya
  sinteada con pesos automaticos, limitada a 4 influencias por vertice.
- **Ciclo de caminata** de 24 fotogramas, en loop (fotograma 1 == ultimo), con
  rodillas, pies, balanceo de brazos y bob de cadera.
- **`.blend`** guardado como fichero de trabajo.
- **`.glb`** exportado con malla + *skin* (joints + pesos) + la animacion `Walk`.
  glTF NO tiene el concepto de hueso "conectado": el esqueleto viaja como
  jerarquia de nodos mas un skin, asi que la contiguidad no cambia el resultado.

Todo es **parametrico**: cambiar la altura regenera el esqueleto completo.

## Como se hace

El codigo vive en
`plugins/3d_rendering/blender/lesna_characters/` (`procedural.py` para el rig y
la malla, `caminata.py` para el clip). No hay tools nuevas del MCP: la entrega es
la tool `execute_blender_code` del servidor MCP `blender`, que ya existe y
ejecuta Python dentro de Blender. Escribir wrappers por cada hueso duplicaria lo
que `bpy` ya hace.

Dentro de Blender (por el MCP), o en un Blender `--background`:

```python
import sys
sys.path.insert(0, "<raiz>/plugins/3d_rendering/blender")
from lesna_characters import ejecutar

ejecutar("procedural_humanoide", {"altura": 1.75})  # rig + malla + piel
ejecutar("caminata_construir", {"frames": 24})      # accion "Walk"
ejecutar("procedural_guardar", {})                   # guarda el .blend
ejecutar("procedural_glb", {})                       # exporta el .glb
```

Operaciones disponibles: `procedural_humanoide`, `procedural_esqueleto`,
`procedural_malla`, `procedural_piel`, `procedural_guardar`, `procedural_glb`,
`caminata_construir`, `caminata_medir`.

## Donde queda

- **Codigo:** `plugins/3d_rendering/blender/lesna_characters/`.
- **`.blend`:** junto al resto de ficheros de trabajo del orquestador
  (`<raiz>/plugins/lesnaclaw/runtime/state/workspace/`, o `~/lesna-characters/`
  si ese directorio no existe). Para fijar tu propia ruta, pasa `ruta` a
  `procedural_guardar` y `procedural_glb`.
- **Pruebas:** `plugins/3d_rendering/blender/tests/test_procedural.py`
  (`blender --background --python ...`) mide el rig con geometria, no a ojo.

## Lo que NO hace

- **No es un modelo final.** La malla es un proxy de cilindros: vale para validar
  el rig y animar, no para una entrega de personaje detallado.
- **No es Rigify.** Es FK puro (sin IK ni controles): se anima por rotaciones de
  hueso. Para posear a mano con pole targets habria que anadir el sistema IK.
- **Solo exporta GLB.** No exporta `.fbx` ni otros formatos; si hacen falta, es
  otro paso.

## Estilo visual

Maniqui estilizado de juego indie: cabeza cubica, torso segmentado, extremidades
rectas, sin cara. Silueta limpia y simetrica, pensada para leerse a poca
resolucion.
