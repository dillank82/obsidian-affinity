import { EditorView, WidgetType } from "@codemirror/view";
import { AffinityDashboard } from "components/AffinityDashboard/AffinityDashboard";
import { AppProvider } from "context";
import { CharacterID } from "interfaces/Realtionships";
import { App, TFile } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";

export class AffinityWidget extends WidgetType {
    private root: Root | null = null
    private container: HTMLElement
    private app: App
    private id: string
    private initialToCharId: CharacterID | null
    private file: TFile

    constructor(containerEl: HTMLElement, app: App, id: string, initialToCharId: CharacterID | null, file: TFile) {
        super()
        this.id = id
        this.initialToCharId = initialToCharId
        this.container = containerEl
        this.app = app
        this.file = file
    }

    eq(widget: AffinityWidget): boolean {
        return (
            widget.id === this.id
            && widget.file.path === this.file.path
            && widget.initialToCharId === this.initialToCharId
        )
    }

    toDOM(view: EditorView): HTMLElement {
        const div = this.container.createDiv({ cls: "affinity-container" })
        this.root = createRoot(div)
        this.root.render(
            <StrictMode>
                <AppProvider app={this.app}>
                    <AffinityDashboard id={this.id} initialToCharId={this.initialToCharId} file={this.file}/>
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