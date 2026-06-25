import { EditorState } from "@codemirror/state";
import { App, Editor, EditorPosition, Notice } from "obsidian";
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

export const appVaultWriter = {
    findBlockRanges: (id: string, doc: string): { from: number, to: number} | null => {
        const lines = doc.split('\n')

        const fromIndex = lines.findIndex(l => l.includes(id))
        if (fromIndex === -1) return null

        const from = lines.slice(0, fromIndex).lastIndexOf('```affinity')
        const to = lines.indexOf('```', from + 1)

        return { from, to }
    },
    updateMarkdownData: async (app: App, ranges: { from: number, to: number }, newData: MarkdownCodeBlockData): Promise<void> => {
        const file = app.workspace.getActiveFile()
        if (!file) {
            new Notice('Failed to write changes: no active file')
            return
        }
        await app.vault.process(file, (data) => {
            const lines = data.split('\n')
            const { from, to } = ranges
            const contnet = dataToMarkdownContent(newData)
            lines.splice(from, to - from + 1, ...contnet.split('\n'))
            return lines.join('\n')
        })
    },
    deleteMarkdownContent: async (app: App, ranges: { from: number, to: number }): Promise<void> => {
        const file = app.workspace.getActiveFile()
        if (!file) {
            new Notice('Failed to delete: no active file')
            return
        }
        await app.vault.process(file, (data) => {
            const lines = data.split('\n')
            const { from, to } = ranges
            lines.splice(from, to - from + 1)
            return lines.join('\n')
        })
    }
}