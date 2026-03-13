import { StatKey, Stats } from "interfaces/Stats"

export const updateAffinity = (rel: Stats, delta: Partial<Stats>) => {
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
    return { newRel, result }
}