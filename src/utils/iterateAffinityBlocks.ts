import { syntaxTree } from "@codemirror/language"
import { EditorState } from "@codemirror/state"
import { getCodeBlockLanguage } from "./codeBlockUtils/getCodeBlockLanguage/getCodeBlockLanguage"
import { parseYaml } from "obsidian"
import { extractCodeBlockData } from "./codeBlockUtils/extractCodeBlockData/extractCodeBlockData"
import { validateCodeBlockData } from "./codeBlockUtils/validateCodeBlockData/validateCodeBlockData"

export interface AffinityNodeData {
    from: number
    to: number
    id: string
    toCharId: string | null
}

export const iterateAffinityBlocks = (state: EditorState, onBlockFound: (data: AffinityNodeData) => void) => {
    const tree = syntaxTree(state)
    const { doc } = state
    let from: number | null

    tree.iterate({
        enter(node) {
            if (node.name.includes('HyperMD-codeblock-begin')) {
                const lang = getCodeBlockLanguage(doc.sliceString(node.from, node.to));
                if (lang === "affinity") from = node.from
            } else if (node.name.includes('HyperMD-codeblock-end') && from !== null) {
                const rawData = extractCodeBlockData(doc.sliceString(from, node.to));
                const { id, toCharId } = validateCodeBlockData(rawData, parseYaml, console.error)
                onBlockFound({ from, to: node.to, id, toCharId })
                from = null
            }
        }
    })
}