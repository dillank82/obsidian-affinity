import AffinityPlugin from "main"
import { MarkdownView, Notice } from "obsidian"
import { dataToMarkdownContent } from "utils/dataToMarkdownContent/dataToMarkdownContent"
import { generateId } from "utils/generateId"

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
}