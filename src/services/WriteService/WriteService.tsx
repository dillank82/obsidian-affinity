import { syntaxTree } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { Editor, EditorPosition } from "obsidian";
import { MarkdownCodeBlockData, MarkdownCodeBlockDataSchema } from "schemas/MarkdownCodeBlockData";
import { dataToMarkdownContent } from "utils/dataToMarkdownContent/dataToMarkdownContent";
import { parseYamlObsidian } from "utils/obsidianParser";

export const findBlockRanges = (state: EditorState, id: string): { from: EditorPosition, to: EditorPosition } | null => {
    const tree = syntaxTree(state)

    let ranges: { from: EditorPosition, to: EditorPosition } | null = null

    tree.iterate({
        enter: (node) => {
            if (node.name === "FencedCode") {
                const doc = state.doc
                const infoStringNode = node.node.getChild("CodeInfo")
                if (infoStringNode) {
                    const lang = doc.sliceString(infoStringNode.from, infoStringNode.to)
                    if (lang === "affinity") {
                        const codeTextNode = node.node.getChild("CodeText")
                        if (codeTextNode) {
                            const codeText = doc.sliceString(codeTextNode?.from, codeTextNode?.to)
                            const rawData = parseYamlObsidian(codeText)
                            const data = MarkdownCodeBlockDataSchema.parse(rawData)
                            if (data.id === id) {
                                const fromLine = doc.lineAt(node.from)
                                const toLine = doc.lineAt(node.to)
                                ranges = {
                                    from: {
                                        line: fromLine.number - 1,
                                        ch: node.from - fromLine.from
                                    },
                                    to: {
                                        line: toLine.number - 1,
                                        ch: node.to - toLine.from
                                    }
                                }
                                return false
                            }
                        }
                    }
                }
            }
        }
    })
    return ranges
}

export const updateMarkdownData = (editor: Editor, data: MarkdownCodeBlockData, from: EditorPosition, to: EditorPosition) => {
    const content = dataToMarkdownContent(data)
    editor.replaceRange(content, from, to)
}