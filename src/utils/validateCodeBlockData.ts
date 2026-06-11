import { parseYaml } from "obsidian"
import { MarkdownCodeBlockData, MarkdownCodeBlockDataSchema } from "schemas/MarkdownCodeBlockData"
import { generateId } from "./generateId"
import { CharacterID } from "interfaces/Realtionships"

export const validateCodeBlockData = (stringData: string, onError?: (err: unknown) => void) => {
    let id: string
    let toCharId: CharacterID | null
    try {
        const raw: unknown = parseYaml(stringData)
        if (!raw) {
            id = generateId()
            toCharId = null
        } else {
            const data: MarkdownCodeBlockData = MarkdownCodeBlockDataSchema.parse(raw)
            id = data.id
            toCharId = data.toCharId || null
        }
    } catch (err) {
        id = generateId()
        toCharId = null
        if (onError) onError(err)
    }
    return { id, toCharId }
}