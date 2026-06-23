import { EditorView } from "@codemirror/view"
import AffinityPlugin from "main"
import { MarkdownView, Notice } from "obsidian"
import { dataToMarkdownContent } from "utils/dataToMarkdownContent/dataToMarkdownContent"
import { generateId } from "utils/generateId"
import { iterateAffinityBlocks } from "utils/iterateAffinityBlocks"
import { widgetRegistry } from "widgetFocusRegistry"

export const addCommands = (plugin: AffinityPlugin) => {
    plugin.addCommand({
        id: 'create-code-block',
        name: 'Insert relationships tracker',
        callback: () => {
            const editor = plugin.app.workspace.getActiveViewOfType(MarkdownView)?.editor
            if (!editor) {
                new Notice('Open a note to insert the tracker.')
                return
            }

            const codeBlock = dataToMarkdownContent({ id: generateId(), toCharId: null })
            editor.replaceSelection(codeBlock)
        }
    })

    plugin.addCommand({
        id: 'focus-next-widget',
        name: 'Focus widget (in order)',
        checkCallback: (checking) => {
            const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
            if (!view) return false
            
            let docHasWidget: boolean = false
            const editor = view.editor
            // A necessary hack to gain access to the private CodeMirror API
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            const editorView = (editor as any).cm as EditorView
            iterateAffinityBlocks(editorView.state, () => { if (!docHasWidget) docHasWidget = true })
            if (!docHasWidget) return false

            if (!checking) widgetRegistry.focusNext(view.file!.path)
            return true
        }
    })
}