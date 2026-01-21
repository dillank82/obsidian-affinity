import { AffinityData } from "./interfaces/AffinityData"
import { STAT_NAMES, StatKey, Stats } from "./interfaces/Stats"
import { FrontMatterCache } from "obsidian"

export const isStatKey = (key: string): key is StatKey => {
    return (STAT_NAMES as ReadonlyArray<string>).includes(key)
}

const isAffinityData = (data: unknown): data is AffinityData => {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return false

    const entries = Object.entries(data)

    return entries.every(([_, value]) => {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

        const isValueValid = Object.entries(value as Stats).every(([statName, statValue]) => (
            isStatKey(statName) && typeof statValue === 'number'
        ))
        return isValueValid
    })
}

export const parseAffinityData = (cache: FrontMatterCache | null) => {
    if (!cache) return null
    const data: unknown = cache.affinityPluginData
    return isAffinityData(data) ? data : null
} 