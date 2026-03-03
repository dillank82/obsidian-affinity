import { AffinityDashboard } from "components/AffinityDashboard/AffinityDashboard";
import { AffinityData } from "interfaces/AffinityData";
import { MarkdownPostProcessorContext } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";

export class AffinityProcessor {
    private roots: Map<HTMLElement, Root> = new Map()

    async process(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext, data: AffinityData | null) {
        const rootContainer = el.createDiv({ cls: "affinity-container" })
        const root = createRoot(rootContainer)
        this.roots.set(el, root)

        root.render(
            <StrictMode>
                <AffinityDashboard rawData={data} />
            </StrictMode>
        )
    }
}