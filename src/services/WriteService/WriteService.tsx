import { syntaxTree } from "@codemirror/language";
import { EditorState } from "@codemirror/state";

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
                                const idRegex = new RegExp(`^id:\\s*${id}$`, 'm')
                                if (idRegex.test(codeText.trim())) {
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