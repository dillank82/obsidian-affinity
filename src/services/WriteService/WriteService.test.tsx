import { EditorState } from "@codemirror/state"
import { markdown } from "@codemirror/lang-markdown"
import { findBlockRanges } from "./WriteService"
import { generateId } from "utils/generateId"
import { parseYamlObsidian } from "utils/obsidianParser"

jest.mock('utils/obsidianParser', () => ({
    parseYamlObsidian: jest.fn((yaml: string) => {})
}))
const mockParser = parseYamlObsidian as jest.Mock

describe('findBlockRanges', () => {
    const createState = (doc: string) => {
        const state = EditorState.create({
            doc,
            extensions: [markdown()]
        })
        return state
    }
    it('finds affinity code block ranges by id', () => {
        const id = generateId()
        const doc = [
            '1234',
            '```affinity',
            `id: ${id}`,
            'toChar: someone',
            '```',
            '1234567'
        ].join('\n')
        const state = createState(doc)
        mockParser.mockImplementationOnce(() => ({
            id,
            toChar: 'someone'
        }))

        expect(findBlockRanges(state, id)).toStrictEqual({
            from: 5,
            to: doc.length - 7 - 1 // 1 to 7 + \n
        })
    })
    it('does not count id without fenced code block', () => {
        const id = generateId()
        const doc = [
            'affinity',
            `id: ${id}67`,
            'toChar: someone',
            '```'
        ].join('\n')
        const state = createState(doc)

        expect(findBlockRanges(state, id)).toBeNull()
    })
    it('does not count other languages', () => {
        const id = generateId()
        const doc = [
            '```affiscript',
            `id: ${id}67`,
            'toChar: someone',
            '```'
        ].join('\n')
        const state = createState(doc)

        expect(findBlockRanges(state, id)).toBeNull()
    })
})