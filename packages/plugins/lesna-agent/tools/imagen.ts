import { existsSync, readFileSync, statSync } from "node:fs"
import { basename, extname, isAbsolute, resolve } from "node:path"

const IMAGE_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".svg": "image/svg+xml",
}

/**
 * Turnos grandes: el content va inline en la respuesta del modelo, asi que sin
 * tope un solo PNG de render puede reventar el contexto de la sesion.
 */
const MAX_BYTES = 8 * 1024 * 1024

interface MostrarImagenInput {
  path: string
  caption?: string
}

function parseInput(input: unknown): MostrarImagenInput | string {
  if (typeof input !== "object" || input === null) return "Entrada invalida: se esperaba un objeto."
  const { path, caption } = input as Record<string, unknown>
  if (typeof path !== "string" || !path.trim()) return "Falta el parametro `path`."
  if (caption !== undefined && typeof caption !== "string") return "El parametro `caption` debe ser texto."
  return { path: path.trim(), caption: caption?.trim() }
}

/**
 * Solo se devuelve `content`.
 *
 * La tool no declara un schema de `output`, y `OutputValue<undefined>` es
 * `never`: devolver `output` sin schema hace que el runtime rechace el
 * resultado entero con "The tool returned no schema" y la imagen se pierde.
 * El texto del error y de la leyenda viajan como parte `text` del content.
 */
function fail(text: string) {
  return { metadata: {}, content: [{ type: "text" as const, text }] }
}

/**
 * Muestra una imagen del disco dentro del chat.
 *
 * Las tools aplastaban el resultado a texto y las imagenes se perdian: quien
 * renderiza algo (Blender, Seedance, la galeria) solo dejaba una ruta en el
 * mensaje. Esta tool devuelve el archivo como `Tool.FileContent`, que la UI ya
 * sabe pintar inline, asi que cualquier pipeline de imagen que deje un archivo
 * en disco se ve en el chat sin escribir codigo nuevo para ese pipeline.
 */
export const mostrarImagen = {
  description:
    "Muestra una imagen del disco dentro del chat. Usar despues de renderizar, exportar o descargar cualquier imagen para que el usuario la vea en linea.",
  input: {
    type: "object" as const,
    properties: {
      path: { type: "string", description: "Ruta de la imagen. Relativa al directorio de trabajo o absoluta." },
      caption: { type: "string", description: "Texto breve que acompana a la imagen." },
    },
    required: ["path"],
    additionalProperties: false,
  },
  async execute(input: unknown) {
    const parsed = parseInput(input)
    if (typeof parsed === "string") return fail(parsed)

    const target = isAbsolute(parsed.path) ? parsed.path : resolve(process.cwd(), parsed.path)
    if (!existsSync(target)) return fail(`No existe el archivo: ${target}`)

    const mime = IMAGE_MIME[extname(target).toLowerCase()]
    if (!mime) return fail(`No es una imagen compatible: ${extname(target) || "sin extension"} (${basename(target)})`)

    const size = statSync(target).size
    if (size > MAX_BYTES) {
      return fail(`La imagen pesa ${(size / 1024 / 1024).toFixed(1)} MB y supera el limite de ${MAX_BYTES / 1024 / 1024} MB.`)
    }

    const name = basename(target)
    const label = parsed.caption || name
    const uri = `data:${mime};base64,${readFileSync(target).toString("base64")}`
    return {
      metadata: {},
      content: [
        { type: "text" as const, text: label },
        { type: "file" as const, uri, mime, name },
      ],
    }
  },
}