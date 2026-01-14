import { Action } from "interfaces/Actions";
import { CharacterID, RelationshipsItem } from "interfaces/Realtionships";
import { Stat, StatKey, Stats } from "interfaces/Stats";
import { PluginSettings } from "settings";

export class RelationshipsManager {
    initialStatsValue: 10
    constructor (private settings: PluginSettings, private saveSettings: () => Promise<void>) {}

    async createRelation(from: CharacterID, to: CharacterID) {
        try {
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
        } catch (error) {
            console.error(error)
        }
    }

    getRelation(from: CharacterID, to: CharacterID) {
        return this.settings.relationships.find(r => r.fromChar === from && r.toChar === to)
        || null
    }

    updateAffinity(from: CharacterID, to: CharacterID, delta: Partial<Stats>) {
        try {
            const rel = this.getRelation(from, to)
            if (!rel) { throw new Error('Отношения не найдены') }

            (Object.entries(delta) as [keyof Stats, Stat][]).forEach(([key, value]) => {
                if (key in rel.stats) {
                    rel.stats[key] += value
                }
            })
        } catch (error) {
            console.error(error)
        }
    }
}