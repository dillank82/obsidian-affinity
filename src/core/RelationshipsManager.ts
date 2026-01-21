import { AffinityData } from "interfaces/AffinityData";
import { CharacterID } from "interfaces/Realtionships";
import { StatKey, Stats } from "interfaces/Stats";

export class RelationshipsManager {
    readonly initialStatsValue = 10
    constructor( protected data: AffinityData) {
        this.data = data
    }

    createRelation(to: CharacterID) {
        const rel = this.getRelation(to)
        if (rel) throw new Error('This relation already exists');
        
        const newRel: Stats = {
            affection: this.initialStatsValue,
            respect: this.initialStatsValue,
            trust: this.initialStatsValue,
        }
        const newData: AffinityData = {
            ...this.data,
            [to]: newRel
        }
        return newData
    }

    updateAffinity(to: CharacterID, delta: Partial<Stats>) {
        const rel = this.getRelation(to)
        if (!rel) { throw new Error('Relation not found') }

        const MAX_STAT_VALUE = 20
        const MIN_STAT_VALUE = 1

        const result: Record<StatKey, { value: number, change: number, status: string }> = {
            affection: {
                value: rel.affection,
                change: 0,
                status: "UNCHANGED"
            },
            respect: {
                value: rel.respect,
                change: 0,
                status: "UNCHANGED"
            },
            trust: {
                value: rel.trust,
                change: 0,
                status: "UNCHANGED"
            }
        }

        for (const [key, change] of Object.entries(delta) as [StatKey, number][]) {
            if (change === 0) continue
            const newValue = result[key].value + change

            if (newValue > MAX_STAT_VALUE) result[key].status = 'MAXED_OUT'
            else if (newValue < MIN_STAT_VALUE) result[key].status = 'MINED_OUT'
            else result[key].status = 'CHANGED'

            const clampedNewValue = Math.max(MIN_STAT_VALUE, Math.min(MAX_STAT_VALUE, newValue))
            result[key].change = clampedNewValue - result[key].value
            result[key].value = clampedNewValue
        }

        const newData: AffinityData = {
            ...this.data,
            [to]: {
                affection: result.affection.value,
                respect: result.respect.value,
                trust: result.trust.value,
            }
        }
        return { newData, result }
    }

    private getRelation(to: CharacterID) {
        return this.data[to] || null
    }
}