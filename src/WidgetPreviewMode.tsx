import { AffinityDashboard } from "components/AffinityDashboard/AffinityDashboard"
import { AppProvider } from "context"
import { CharacterID } from "interfaces/Realtionships"
import { App, MarkdownRenderChild } from "obsidian"
import { StrictMode } from "react"
import { createRoot, Root } from "react-dom/client"

export class WidgetPreviewMode extends MarkdownRenderChild {
    private el: HTMLElement
    private root: Root | null = null
    private id: string
    private fromCharId: CharacterID
    private initialToCharId: CharacterID | null
    private app: App
    constructor(el: HTMLElement, app: App, id: string, fromCharId: CharacterID, initialToCharId: CharacterID | null) {
        super(el)
        this.el = el
        this.id = id
        this.fromCharId = fromCharId
        this.initialToCharId = initialToCharId
        this.app = app
    }

    onload(): void {
        this.el.empty()
        const rootContainer: HTMLDivElement = this.el.createDiv({ cls: "affinity-container" })
        this.root = createRoot(rootContainer)
        this.root.render(
            <StrictMode>
                <AppProvider app={this.app}>
                    <AffinityDashboard id={this.id} fromChar={this.fromCharId} initialToCharId={this.initialToCharId} />
                </AppProvider>
            </StrictMode>
        )
    }

    onunload(): void {
        if (this.root) {
            this.root.unmount()
            this.root = null
        }
    }
}