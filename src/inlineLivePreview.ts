import { EditorState, Extension, RangeSetBuilder, StateField, Transaction } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView } from "@codemirror/view"
import { CharacterID } from "interfaces/Realtionships"
import { App } from "obsidian"
import { AffinityNodeData, iterateAffinityBlocks } from "utils/iterateAffinityBlocks"
import { AffinityWidget } from "widget"

export const affinityField = (containerEl: HTMLElement, app: App, fromCharId: () => CharacterID) => StateField.define<DecorationSet>({
    create(state: EditorState): DecorationSet {
        return Decoration.none
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        if (!transaction.docChanged && oldState !== Decoration.none) return oldState

        const builder = new RangeSetBuilder<Decoration>()

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
    },
    provide(field: StateField<DecorationSet>): Extension {
        return [
            EditorView.decorations.from(field),
            EditorView.atomicRanges.of(view => view.state.field(field))
        ]
    }
})