import { EditorState, Extension, RangeSetBuilder, StateField, Transaction } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView } from "@codemirror/view"
import { CharacterID } from "interfaces/Realtionships"
import { App } from "obsidian"
import { AffinityNodeData, iterateAffinityBlocks } from "utils/iterateAffinityBlocks"
import { AffinityWidget } from "widget"

export const affinityField = (containerEl: HTMLElement, app: App, fromCharId: () => CharacterID) => StateField.define<DecorationSet>({
    create(state: EditorState): DecorationSet {
        return buildDecorations(state, containerEl, app, fromCharId)
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        if (!transaction.docChanged) return oldState
        return buildDecorations(transaction.state, containerEl, app, fromCharId)
    },
    provide(field: StateField<DecorationSet>): Extension {
        return [
            EditorView.decorations.from(field),
            EditorView.atomicRanges.of(view => view.state.field(field))
        ]
    }
})

const buildDecorations = (state: EditorState, containerEl: HTMLElement, app: App, fromCharId: () => CharacterID): DecorationSet => {
    const builder = new RangeSetBuilder<Decoration>()
    const tree = syntaxTree(state)

        const addWidget = (data: AffinityNodeData) => {
            const { from, to, id, toCharId } = data
            builder.add(
                from,
                to,
                Decoration.replace({
                    widget: new AffinityWidget(containerEl, app, id, fromCharId(), toCharId),
                    block: true
                })
            )
        }

        iterateAffinityBlocks(transaction.state, addWidget)

    return builder.finish()
}