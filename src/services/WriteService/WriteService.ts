import { EditorState } from "@codemirror/state";
import { Editor, EditorPosition } from "obsidian";
import { MarkdownCodeBlockData } from "schemas/MarkdownCodeBlockData";
import { dataToMarkdownContent } from "utils/dataToMarkdownContent/dataToMarkdownContent";
import { AffinityNodeData, iterateAffinityBlocks } from "utils/iterateAffinityBlocks";

export const findBlockRanges = (state: EditorState, id: string): { from: EditorPosition, to: EditorPosition } | null => {
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

export const updateMarkdownData = (editor: Editor, data: MarkdownCodeBlockData, from: EditorPosition, to: EditorPosition) => {
    const content = dataToMarkdownContent(data)
    editor.replaceRange(content, from, to)
}

export const deleteMarkdownContent = (editor: Editor, from: EditorPosition, to: EditorPosition) => {
    editor.replaceRange('', from, to)
}