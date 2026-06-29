import { EditorView } from "@codemirror/view"
import { useApp } from "context"
import { MarkdownView, Notice } from "obsidian"
import { FC, useState } from "react"
import { appVaultWriter, editorWriter } from "services/WriteService/WriteService"
import { X } from "lucide-react"

interface DeleteButtonProps {
    codeBlockId: string
}

export const DeleteButton: FC<DeleteButtonProps> = ({ codeBlockId }) => {
    const app = useApp()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const deleteWidget = async () => {
        setIsLoading(true)
        try {
            const view = app.workspace.getActiveViewOfType(MarkdownView)
            if (!view) {
                new Notice('Failed to save character selection. No active view.')
                return
            }
            const editor = view?.editor
            // A necessary hack to gain access to the private CodeMirror API
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            const editorView = (editor as any).cm as EditorView
            if (!editor || !editorView) {
                new Notice('Failed to delete widget. No active editor.')
                return
            }

            const viewMode = view.getMode()
            switch (viewMode) {
                case "source": {
                    const ranges = editorWriter.findBlockRanges(editorView.state, codeBlockId)
                    if (!ranges) {
                        new Notice('Failed to delete widget: cannot find current code block range.')
                        return
                    }
                    const { from, to } = ranges
                    editorWriter.deleteMarkdownContent(editor, from, to)
                    break
                }
                case "preview": {
                    const file = app.workspace.getActiveFile()
                    if (!file) {
                        new Notice('Failed to save character selection: no active file.')
                        return
                    }
                    const ranges = appVaultWriter.findBlockRanges(await app.vault.read(file), codeBlockId)
                    if (!ranges) {
                        new Notice('Failed to delete widget: cannot find current code block range.')
                        return
                    }
                    await appVaultWriter.deleteMarkdownContent(app, ranges)
                    break
                }
            }
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : String(err)
            new Notice(`Failed to delete widget: ${errMsg}.`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            disabled={isLoading}
            aria-disabled={isLoading}
            // promise handled with loading state and error catching
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={deleteWidget}
            aria-label="Delete widget"
        >
            <X aria-hidden />
        </button>
    )
}