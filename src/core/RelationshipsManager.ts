import { CharacterID, RelationshipsItem } from "interfaces/Realtionships";
import { Stat, Stats } from "interfaces/Stats";
import { PluginSettings } from "settings";

export class RelationshipsManager {
    initialStatsValue: 10
    constructor(private settings: PluginSettings, private saveSettings: () => Promise<void>) { }

    async createRelation(from: CharacterID, to: CharacterID) {
        const rel = this.getRelation(from, to)
        if (rel) throw new Error('Связь уже существует')

        const newRel: RelationshipsItem = {
            fromChar: from,
            toChar: to,
            stats: {
                affection: this.initialStatsValue,
                respect: this.initialStatsValue,
                trust: this.initialStatsValue,
            }
        }
        this.settings.relationships.push(newRel)
        await this.saveSettings()
    }

    getRelation(from: CharacterID, to: CharacterID) {
        return this.settings.relationships.find(r => r.fromChar === from && r.toChar === to)
            || null
    }

    updateAffinity(from: CharacterID, to: CharacterID, delta: Partial<Stats>) {
        const rel = this.getRelation(from, to)
        if (!rel) { throw new Error('Отношения не найдены') }

        (Object.entries(delta) as [keyof Stats, Stat][]).forEach(([key, value]) => {
            if (key in rel.stats) {
                rel.stats[key] += value
            }
        })
    }
}