import { ItemView, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from "react";
import { AffinityDashboard } from "components/AffinityDashboard/AffinityDashboard";
import AffinityPlugin from "main";

export const VIEW_TYPE_MAIN = 'main-view'

export class AffinityView extends ItemView {
    root: Root | null = null
    plugin: AffinityPlugin;

    constructor (leaf: WorkspaceLeaf, plugin: AffinityPlugin) {
        super(leaf)
        this.plugin = plugin
    }

    getViewType(): string {
        return VIEW_TYPE_MAIN
    }

    getDisplayText(): string {
        return 'Main view'
    }

    private getComponentData() {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) return null; 
        return this.plugin.getMetadata(activeFile);
    }

    protected async onOpen(): Promise<void> {
        const data = this.getComponentData()
        this.root = createRoot(this.contentEl)
        this.root.render(
            <StrictMode>
                <AffinityDashboard rawData={data}/>
            </StrictMode>
        )
    }

    protected async onClose(): Promise<void> {
        this.root?.unmount()
    }
}