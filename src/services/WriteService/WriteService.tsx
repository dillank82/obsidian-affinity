import { syntaxTree } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { MarkdownCodeBlockDataSchema } from "schemas/MarkdownCodeBlockData";
import { parseYamlObsidian } from "utils/obsidianParser";

export class WriteService {
    constructor(private editorState: EditorState) { }

    findBlockRanges(id: string): { from: number, to: number } | null {
        const tree = syntaxTree(this.editorState)
        
        let ranges: { from: number, to: number } | null = null

        tree.iterate({
            enter: (node) => {
                if (node.name === "FencedCode") {
                    const doc = this.editorState.doc
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
                                    ranges = {
                                        from: node.from,
                                        to: node.to
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
}