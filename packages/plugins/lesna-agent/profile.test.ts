import { describe, expect, test } from "bun:test"
import { enforceBudget } from "./profile"

const profile = (lines: number) => Array.from({ length: lines }, (_, index) => `linea ${index + 1}`).join("\n")

describe("enforceBudget", () => {
  test("deja el perfil intacto justo en el tope", () => {
    expect(enforceBudget(profile(150))).toBe(profile(150))
  })

  test("avisa y conserva el original cuando se pasa", () => {
    const over = profile(151)
    const result = enforceBudget(over)
    expect(result.startsWith(over)).toBe(true)
    expect(result).toContain("151 líneas")
    expect(result).toContain("tope es 150")
  })
})
