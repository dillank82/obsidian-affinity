import { STAT_MAPS, StatRange, Stats, StatsLabels } from "interfaces/Stats"

export const mapStats = (stats: Stats): StatsLabels => {
    const getLabel = (value: number, ranges: readonly StatRange[]): string => {
        const found = ranges.find(r => value >= r.min && value <= r.max)
        return found?.label ?? 'Unknown'
    }
    return {
        affection: getLabel(stats.affection, STAT_MAPS.affection),
        respect: getLabel(stats.respect, STAT_MAPS.respect),
        trust: getLabel(stats.trust, STAT_MAPS.trust),
    }
}