import { markdownLanguage } from "@codemirror/lang-markdown"
import { EditorState, Extension, RangeSetBuilder, StateField, Transaction } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView } from "@codemirror/view"
import { CharacterID } from "interfaces/Realtionships"
import { App } from "obsidian"
import { validateCodeBlockData } from "utils/validateCodeBlockData"
import { AffinityWidget } from "widget"

export const affinityField = (containerEl: HTMLElement, app: App, fromCharId: CharacterID) => StateField.define<DecorationSet>({
    create(state: EditorState): DecorationSet {
        return Decoration.none
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>()

        const tree = markdownLanguage.parser.parse(transaction.state.doc.toString())

        tree.iterate({
            enter(node) {
                if (node.type.name.startsWith('FencedCode')) {
                    const doc = transaction.state.doc
                    const infoStringNode = node.node.getChild("CodeInfo")
                    if (infoStringNode) {
                        const lang = doc.sliceString(infoStringNode.from, infoStringNode.to)
                        if (lang === "affinity") {
                            const rawData = doc.sliceString(node.from, node.to)
                            const { id, toCharId } = validateCodeBlockData(rawData)
                            builder.add(
                                node.from,
                                node.to,
                                Decoration.replace({
                                    widget: new AffinityWidget(containerEl, app, id, fromCharId, toCharId)
                                })
                            )
                        }
                    }
                }
            }
        })

        return builder.finish()
    },
    provide(field: StateField<DecorationSet>): Extension {
        return EditorView.decorations.from(field)
    }
})