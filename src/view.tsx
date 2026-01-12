import { ItemView, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from "react";
import { AffinityDashboard } from "components/AffinityDashboard";

export const VIEW_TYPE_MAIN = 'main-view'

export class MainView extends ItemView {
    root: Root | null = null

    constructor (leaf: WorkspaceLeaf) {
        super(leaf)
    }

    getViewType(): string {
        return VIEW_TYPE_MAIN
    }

    getDisplayText(): string {
        return 'Main view'
    }

    protected async onOpen(): Promise<void> {
        this.root = createRoot(this.contentEl)
        this.root.render(
            <StrictMode>
                <AffinityDashboard />
            </StrictMode>
        )
    }
}