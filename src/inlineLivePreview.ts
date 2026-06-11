import { syntaxTree } from "@codemirror/language"
import { EditorState, Extension, RangeSetBuilder, StateField, Transaction } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView } from "@codemirror/view"
import { CharacterID } from "interfaces/Realtionships"
import { App } from "obsidian"
import { extractCodeBlockData } from "utils/extractCodeBlockData"
import { getCodeBlockLanguage } from "utils/getCodeBlockLanguage"
import { validateCodeBlockData } from "utils/validateCodeBlockData"
import { AffinityWidget } from "widget"

export const affinityField = (containerEl: HTMLElement, app: App, fromCharId: () => CharacterID) => StateField.define<DecorationSet>({
    create(state: EditorState): DecorationSet {
        return Decoration.none
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        if (!transaction.docChanged && oldState !== Decoration.none) return oldState

        const builder = new RangeSetBuilder<Decoration>()
        const tree = syntaxTree(transaction.state)

        let from: number

        tree.iterate({
            enter(node) {
                const doc = transaction.state.doc
                if (node.name.includes('HyperMD-codeblock-begin')) {
                    const lang = getCodeBlockLanguage(doc.sliceString(node.from, node.to))
                    if (lang === "affinity") from = node.from
                } else if (node.name.includes('HyperMD-codeblock-end')) {
                    const codeBlock = doc.sliceString(from, node.to)
                    const rawData = extractCodeBlockData(codeBlock)
                    const { id, toCharId } = validateCodeBlockData(rawData, console.error)
                    builder.add(
                        from,
                        node.to,
                        Decoration.replace({
                            widget: new AffinityWidget(containerEl, app, id, fromCharId(), toCharId),
                            block: true
                        })
                    )
                }
            }
        })

        return builder.finish()
    },
    provide(field: StateField<DecorationSet>): Extension {
        return EditorView.decorations.from(field)
    }
})