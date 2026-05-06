import { EditorState } from "@codemirror/state"
import { markdown } from "@codemirror/lang-markdown"
import { WriteService } from "./WriteService"

describe('findBlockRanges', () => {
    const createState = (doc: string) => {
        const state = EditorState.create({
            doc,
            extensions: [markdown()]
        })
        return state
    }
    it('finds affinity code block ranges by id', () => {
        const id = 'test13'
        const doc = [
            '1234',
            '```affinity',
            `id: ${id}`,
            'toChar: someone',
            '```',
            '1234567'
        ].join('\n')
        const state = createState(doc)

        expect(new WriteService(state).findBlockRanges(id)).toStrictEqual({
            from: 5,
            to: doc.length - 7 - 1 // 1 to 7 + \n
        })
    })
    it('does not count id with extra characters', () => {
        const id = 'test13'
        const doc = [
            '```affinity',
            `id: ${id}67`,
            'toChar: someone',
            '```'
        ].join('\n')
        const state = createState(doc)

        expect(new WriteService(state).findBlockRanges(id)).toBeNull()
    })
    it('does not count id without fenced code block', () => {
        const id = 'test13'
        const doc = [
            'affinity',
            `id: ${id}67`,
            'toChar: someone',
            '```'
        ].join('\n')
        const state = createState(doc)

        expect(new WriteService(state).findBlockRanges(id)).toBeNull()
    })
    it('does not count other languages', () => {
        const id = 'test13'
        const doc = [
            '```affiscript',
            `id: ${id}67`,
            'toChar: someone',
            '```'
        ].join('\n')
        const state = createState(doc)

        expect(new WriteService(state).findBlockRanges(id)).toBeNull()
    })
})