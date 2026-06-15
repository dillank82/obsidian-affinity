import { EditorView, WidgetType } from "@codemirror/view";
import { AffinityDashboard } from "components/AffinityDashboard/AffinityDashboard";
import { AppProvider } from "context";
import { CharacterID } from "interfaces/Realtionships";
import { App } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";

export class AffinityWidget extends WidgetType {
    private root: Root | null = null
    private container: HTMLElement
    private app: App
    private id: string
    private fromCharId: CharacterID
    private initialToCharId: CharacterID | null

    constructor(containerEl: HTMLElement, app: App, id: string, fromCharId: CharacterID, initialToCharId: CharacterID | null) {
        super()
        this.id = id
        this.fromCharId = fromCharId
        this.initialToCharId = initialToCharId
        this.container = containerEl
        this.app = app
    }

    eq(widget: AffinityWidget): boolean {
        return (
            widget.id === this.id
            && widget.fromCharId === this.fromCharId
            && widget.initialToCharId === this.initialToCharId
        )
    }

    toDOM(view: EditorView): HTMLElement {
        const div = this.container.createDiv({ cls: "affinity-container" })
        this.root = createRoot(div)
        this.root.render(
            <StrictMode>
                <AppProvider app={this.app}>
                    <AffinityDashboard id={this.id} fromChar={this.fromCharId} initialToCharId={this.initialToCharId} />
                </AppProvider>
            </StrictMode>
        )
        return div
    }

    destroy(): void {
        if (this.root) {
            this.root.unmount()
            this.root = null
        }
    }
}