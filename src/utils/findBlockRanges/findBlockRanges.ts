import { EditorState } from "@codemirror/state"
import { EditorPosition } from "obsidian"
import { AffinityNodeData, iterateAffinityBlocks } from "utils/iterateAffinityBlocks"

export const findBlockRangesEditor = (state: EditorState, id: string): { from: EditorPosition, to: EditorPosition } | null => {
    let ranges: { from: EditorPosition, to: EditorPosition } | null = null
    const setRanges = (data: AffinityNodeData) => {
        const foundedId = data.id
        if (id === foundedId) {
            const { from, to } = data
            const fromLine = state.doc.lineAt(from)
            const toLine = state.doc.lineAt(to)
            ranges = {
                from: {
                    line: fromLine.number - 1,
                    ch: from - fromLine.from
                },
                to: {
                    line: toLine.number - 1,
                    ch: to - toLine.from

                }

            }
        }
    }

    iterateAffinityBlocks(state, setRanges)
    return ranges
}

export const findBlockRangesApp = (doc: string, id: string): { from: number, to: number } | null => {
    const lines = doc.split('\n')

    const fromIndex = lines.findIndex(l => l.includes(id))
    if (fromIndex === -1) return null

    const from = lines.slice(0, fromIndex).lastIndexOf('```affinity')
    const to = lines.indexOf('```', from + 1)

    return { from, to }
}