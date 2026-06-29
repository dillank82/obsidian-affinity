import { EditorState } from "@codemirror/state"
import { AffinityNodeData, iterateAffinityBlocks } from "utils/iterateAffinityBlocks"
import { findBlockRangesApp, findBlockRangesEditor } from "./findBlockRanges"

jest.mock('utils/iterateAffinityBlocks', () => ({
    iterateAffinityBlocks: jest.fn((state: EditorState, callback: (data: AffinityNodeData) => void) => { })
}))
const mockIterator = iterateAffinityBlocks as jest.Mock

describe('findBlockRanges (editor)', () => {
    const createState = (doc: string) => EditorState.create({ doc })

    it('finds affinity code block ranges by id', () => {
        const id = '71d48b14-3840-4761-916b-2003a1877e2d' //36 chars
        const doc = [
            '1234', // 0-4
            '```affinity', // 5-16
            `   id: ${id}`, // 17-60 (60 = 23 + 36 + 1(\n))
            '   toChar: someone', // 61-79
            '```', // 80-83
            '1234567'
        ].join('\n')
        const state = createState(doc)
        mockIterator.mockImplementationOnce((_state: EditorState, callback: (data: AffinityNodeData) => void) => {
            callback({ id: id, from: 5, to: 83, toCharId: null })
        })

        expect(findBlockRangesEditor(state, id)).toStrictEqual({
            from: {
                line: 1,
                ch: 0
            },
            to: {
                line: 4,
                ch: 3 // 0-index + half-open intervals in AST nodes
            }
        })
    })
    it('should return null if ids mismatch', () => {
        const id1 = '71d48b14-3840-4761-916b-2003a1877e2d'
        const id2 = 'c9992e89-0459-44fc-b562-06df1db3c8bc'
        const state = createState('1234567')
        mockIterator.mockImplementationOnce((_state: EditorState, callback: (data: AffinityNodeData) => void) => {
            callback({ id: id1, from: 0, to: 7, toCharId: null })
        })

        expect(findBlockRangesEditor(state, id2)).toBeNull()
    })
})

describe('findBlockRanges (app)', () => {
    it('finds affinity code block ranges by id', () => {
        const id = '71d48b14-3840-4761-916b-2003a1877e2d'
        const doc = [
            '0line',
            '1line',
            '```affinity',
            `  id: ${id}`,
            '  !@#$%^&*()_+a',
            '```',
            '5line'
        ].join('\n')
        expect(findBlockRangesApp(id, doc)).toEqual({ from: 2, to: 5 })
    })
    it('should return null if ids mismatch', () => {
        const id1 = '71d48b14-3840-4761-916b-2003a1877e2d'
        const id2 = 'c9992e89-0459-44fc-b562-06df1db3c8bc'
        const doc = [
            '0line',
            '1line',
            '```affinity',
            `  id: ${id2}`,
            '  !@#$%^&*()_+a',
            '```',
            '5line'
        ].join('\n')
        expect(findBlockRangesApp(id1, doc)).toBeNull()
    })
})