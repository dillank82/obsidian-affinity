import { EditorView } from "@codemirror/view"
import { useApp } from "context"
import { MarkdownView, Notice } from "obsidian"
import { FC } from "react"
import { deleteMarkdownContent, findBlockRanges } from "services/WriteService/WriteService"
import { X } from "lucide-react"

interface DeleteButtonProps {
    codeBlockId: string
}

export const DeleteButton: FC<DeleteButtonProps> = ({ codeBlockId }) => {
    const app = useApp()
    const deleteWidget = () => {
        try {
            const editor = app.workspace.getActiveViewOfType(MarkdownView)?.editor
            // A necessary hack to gain access to the private CodeMirror API
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            const editorView = (editor as any).cm as EditorView
            if (!editor || !editorView) {
                new Notice('Failed to delete widget. No active editor.')
                return
            }

            const state = editorView.state
            const ranges = findBlockRanges(state, codeBlockId)

            if (!ranges) {
                new Notice('Failed to delete widget: cannot find current code block range.')
                return
            }
            const { from, to } = ranges

            deleteMarkdownContent(editor, from, to)
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : String(err)
            new Notice(`Failed to delete widget: ${errMsg}.`)
        }
    }

    return (
        <button
            onClick={deleteWidget}
            aria-label="Delete widget"
        >
            <X aria-hidden/>
        </button>
    )
}