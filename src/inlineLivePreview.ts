import { syntaxTree } from "@codemirror/language"
import { EditorState, Extension, RangeSetBuilder, StateField, Transaction } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView } from "@codemirror/view"
import { CharacterID } from "interfaces/Realtionships"
import { App } from "obsidian"
import { getCodeBlockLanguage } from "utils/getCodeBlockLanguage"
import { validateCodeBlockData } from "utils/validateCodeBlockData"
import { AffinityWidget } from "widget"

export const affinityField = (containerEl: HTMLElement, app: App, fromCharId: CharacterID) => StateField.define<DecorationSet>({
    create(state: EditorState): DecorationSet {
        return Decoration.none
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        if (!transaction.docChanged && oldState !== Decoration.none) return oldState

        const builder = new RangeSetBuilder<Decoration>()
        const tree = syntaxTree(transaction.state)

        tree.iterate({
            enter(node) {
                if (node.name === 'formatting_formatting-code-block_hmd-codeblock') {
                    const doc = transaction.state.doc
                    const rawData = doc.sliceString(node.from, node.to)
                    const lang = getCodeBlockLanguage(rawData)
                    if (lang === "affinity") {
                        const { id, toCharId } = validateCodeBlockData(rawData)
                        builder.add(
                            node.from,
                            node.to + 4, //closing backticks is a separate node
                            Decoration.replace({
                                widget: new AffinityWidget(containerEl, app, id, fromCharId, toCharId),
                                block: true
                            })
                        )
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