import { MarkdownCodeBlockData, MarkdownCodeBlockDataSchema } from "schemas/MarkdownCodeBlockData"
import { CharacterID } from "interfaces/Realtionships"
import { generateId } from "utils/generateId"

export const validateCodeBlockData = (stringData: string, yamlParser: (yaml: string) => unknown, onError?: (err: unknown) => void) => {
    let id: string
    let toCharId: CharacterID | null
    try {
        const raw: unknown = yamlParser(stringData)
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