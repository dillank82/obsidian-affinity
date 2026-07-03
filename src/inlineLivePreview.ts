import { EditorState, Extension, RangeSetBuilder, StateField, Transaction } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView } from "@codemirror/view"
import { App, editorInfoField } from "obsidian"
import { AffinityNodeData, iterateAffinityBlocks } from "utils/iterateAffinityBlocks"
import { AffinityWidget } from "widget"

export const affinityField = (containerEl: HTMLElement, app: App) => StateField.define<DecorationSet>({
    create(state: EditorState): DecorationSet {
        return buildDecorations(state, containerEl, app)
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        if (!transaction.docChanged) return oldState
        return buildDecorations(transaction.state, containerEl, app)
    },
    provide(field: StateField<DecorationSet>): Extension {
        return [
            EditorView.decorations.from(field),
            EditorView.atomicRanges.of(view => view.state.field(field))
        ]
    }
})

const buildDecorations = (state: EditorState, containerEl: HTMLElement, app: App): DecorationSet => {
    const builder = new RangeSetBuilder<Decoration>()
    const addWidget = (data: AffinityNodeData) => {
        const { from, to, id, toCharId } = data
        const file = state.field(editorInfoField).file
        if (!file) throw new Error ("Unexpected rendering error: currently active file cannot be accessed")
        builder.add(
            from,
            to,
            Decoration.replace({
                widget: new AffinityWidget(containerEl, app, id, toCharId, file),
                block: true
            })
        )
    }
    
    iterateAffinityBlocks(state, addWidget)
    return builder.finish()
}