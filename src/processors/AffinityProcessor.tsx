import { AffinityDashboard } from "components/AffinityDashboard/AffinityDashboard";
import { CharacterID } from "interfaces/Realtionships";
import { MarkdownPostProcessorContext } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { Store } from "store";
import { UseBoundStore, StoreApi } from "zustand";

export class AffinityProcessor {
    private roots: Map<HTMLElement, Root> = new Map()

    async process(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext, store: UseBoundStore<StoreApi<Store>> , id: CharacterID) {
        const rootContainer = el.createDiv({ cls: "affinity-container" })
        const root = createRoot(rootContainer)
        this.roots.set(el, root)

        root.render(
            <StrictMode>
                <AffinityDashboard useStore={store} fromChar={id}/>
            </StrictMode>
        )
    }
}