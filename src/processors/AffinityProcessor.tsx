import { AffinityDashboard } from "components/AffinityDashboard/AffinityDashboard";
import { RelationshipsManager } from "core/RelationshipsManager";
import { CharacterID } from "interfaces/Realtionships";
import { MarkdownPostProcessorContext } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { Store } from "store";

export class AffinityProcessor {
    private roots: Map<HTMLElement, Root> = new Map()

    async process(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext, relManager: RelationshipsManager, id: CharacterID, store: Store) {
        const rootContainer = el.createDiv({ cls: "affinity-container" })
        const root = createRoot(rootContainer)
        this.roots.set(el, root)

        root.render(
            <StrictMode>
                <AffinityDashboard relManager={relManager} fromChar={id} store={store}/>
            </StrictMode>
        )
    }
}