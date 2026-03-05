import { CharacterID } from "interfaces/Realtionships";
import { StatKey, Stats } from "interfaces/Stats";
import { Store } from "store";

export class RelationshipsManager {
    readonly initialStatsValue = 10
    store: Store;
    
    constructor(store: Store) {
        this.store = store
    }

    createRelation(from: CharacterID, to: CharacterID) {
        const rel = this.getRelation(from, to)
        if (rel) throw new Error('This relation already exists')

        const newRel: Stats = {
            affection: this.initialStatsValue,
            respect: this.initialStatsValue,
            trust: this.initialStatsValue,
        }

        this.store.setRelation(from, to, newRel)

        return newRel
    }

    updateAffinity(from: CharacterID, to: CharacterID, delta: Partial<Stats>) {
        const rel = this.getRelation(from, to)
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

        const newRel = {
            affection: result.affection.value,
            respect: result.respect.value,
            trust: result.trust.value,
        }

        this.store.setRelation(from, to, newRel)
        
        return { newRel, result }
    }

    getRelation(from: CharacterID, to: CharacterID) {
        return (this.store.relationships[from]?.[to]) || null
    }
}