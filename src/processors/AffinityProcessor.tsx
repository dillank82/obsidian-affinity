import { AffinityDashboard } from "components/AffinityDashboard/AffinityDashboard";
import { Character, CharacterID } from "interfaces/Realtionships";
import { MarkdownPostProcessorContext, Notice, parseYaml } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { MarkdownCodeBlockData, MarkdownCodeBlockDataSchema } from "schemas/MarkdownCodeBlockData";
import { generateId } from "utils/generateId";

export class AffinityProcessor {
    private roots: Map<HTMLElement, Root> = new Map()

    async process(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext, fromCharid: CharacterID, chars: Character[]) {
        const rootContainer = el.createDiv({ cls: "affinity-container" })
        const root = createRoot(rootContainer)
        this.roots.set(el, root)

        let id: string
        let toCharId: CharacterID | null
        try {
            const raw: unknown = parseYaml(source)
            if (!raw) {
                id = generateId()
                toCharId = null
            } else {
                const data: MarkdownCodeBlockData = MarkdownCodeBlockDataSchema.parse(raw)
                id = data.id
                toCharId = data.toCharId || null
            }
        } catch {
            id = generateId()
            toCharId = null
            new Notice ('Unable to restore character selection. Markdown data is corrupted.')
        }

        root.render(
            <StrictMode>
                <AffinityDashboard fromChar={fromCharid} characters={chars} id={id} initialToCharId={toCharId}/>
            </StrictMode>
        )
    }
}