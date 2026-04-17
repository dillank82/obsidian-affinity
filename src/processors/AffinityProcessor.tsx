import { AffinityDashboard } from "components/AffinityDashboard/AffinityDashboard";
import { Character, CharacterID } from "interfaces/Realtionships";
import { MarkdownPostProcessorContext, parseYaml } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";

export class AffinityProcessor {
    private roots: Map<HTMLElement, Root> = new Map()

    async process(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext, id: CharacterID, chars: Character[]) {
        const rootContainer = el.createDiv({ cls: "affinity-container" })
        const root = createRoot(rootContainer)
        this.roots.set(el, root)

        try {
            const parseYaml(source)
        } catch (error) {
            
        }

        root.render(
            <StrictMode>
                <AffinityDashboard fromChar={id} characters={chars}/>
            </StrictMode>
        )
    }
}