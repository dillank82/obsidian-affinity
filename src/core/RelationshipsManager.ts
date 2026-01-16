import { CharacterID, RelationshipsItem } from "interfaces/Realtionships";
import { Stat, Stats } from "interfaces/Stats";
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
        const statuses = {
            affection: 'UNCHANGED',
            respect: 'UNCHANGED',
            trust: 'UNCHANGED'
        };

        (Object.entries(delta) as [keyof Stats, Stat][]).forEach(([key, value]) => {
            if (key in rel.stats) {
                rel.stats[key] += value
                statuses[key] = 'CHANGED'
            }
        })

        await this.saveSettings()
        return {
            affection: {
                value: rel.stats.affection,
                change: delta.affection || 0,
                status: statuses.affection
            },
            respect: {
                value: rel.stats.respect,
                change: delta.respect || 0,
                status: statuses.respect
            },
            trust: {
                value: rel.stats.trust,
                change: delta.trust || 0,
                status: statuses.trust
            },
        }
    }
}