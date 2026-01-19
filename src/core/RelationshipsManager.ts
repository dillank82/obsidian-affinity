import { CharacterID, RelationshipsItem } from "interfaces/Realtionships";
import { STAT_NAMES, StatKey, Stats } from "interfaces/Stats";
import { PluginSettings } from "settings";

export class RelationshipsManager {
    initialStatsValue: 10
    constructor(private settings: PluginSettings, private saveSettings: () => Promise<void>) { }

    async createRelation(from: CharacterID, to: CharacterID) {
        const rel = this.getRelation(from, to)
        if (rel) throw new Error('This relation already exists')

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
        return this.getRelation(from, to)
    }

    getRelation(from: CharacterID, to: CharacterID) {
        return this.settings.relationships.find(r => r.fromChar === from && r.toChar === to)
            || null
    }

    async updateAffinity(from: CharacterID, to: CharacterID, delta: Partial<Stats>) {
        const rel = this.getRelation(from, to)
        if (!rel) { throw new Error('Relation not found') }

        const MAX_STAT_VALUE = 20
        const MIN_STAT_VALUE = 1

        const result = {} as Record<StatKey, { value: number, change: number, status: string }>

        STAT_NAMES.forEach(key => {
            const stat: number = rel.stats[key]
            let change: number = delta[key] || 0

            let newStat: number = Math.max(MIN_STAT_VALUE, Math.min(MAX_STAT_VALUE, stat + change))
            
            let status: 'CHANGED' | 'UNCHANGED' | 'MINED_OUT' | 'MAXED_OUT' = 'UNCHANGED'
            if (change !== 0) {
                if (stat + change > MAX_STAT_VALUE) status = 'MAXED_OUT'
                else if (stat + change < MIN_STAT_VALUE) status = 'MINED_OUT'
                else status = 'CHANGED'
            }

            rel.stats[key] = newStat

            result[key] = {
                value: newStat,
                change: newStat - stat,
                status
            }
        })
        
        await this.saveSettings()
        return result
    }
}