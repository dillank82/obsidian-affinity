import { App, Editor, EditorPosition, Notice } from "obsidian";
import { MarkdownCodeBlockData } from "schemas/MarkdownCodeBlockData";
import { dataToMarkdownContent } from "utils/dataToMarkdownContent/dataToMarkdownContent";
import { findBlockRangesApp, findBlockRangesEditor } from "utils/findBlockRanges/findBlockRanges";

export const editorWriter = {
    findBlockRanges: findBlockRangesEditor,
    updateMarkdownData: (editor: Editor, data: MarkdownCodeBlockData, from: EditorPosition, to: EditorPosition) => {
        const content = dataToMarkdownContent(data)
        editor.replaceRange(content, from, to)
    },
    deleteMarkdownContent: (editor: Editor, from: EditorPosition, to: EditorPosition) => {
        editor.replaceRange('', from, to)
    }
}

export const appVaultWriter = {
    findBlockRanges: findBlockRangesApp,
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