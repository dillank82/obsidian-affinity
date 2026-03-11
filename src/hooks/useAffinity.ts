import { RelationshipsManager } from "core/RelationshipsManager"
import { CharacterID } from "interfaces/Realtionships"
import { Stats } from "interfaces/Stats"
import { useState, useMemo } from "react"
import { mapStats } from "utils/mapStats"

export const useAffinity = (relManager: RelationshipsManager, fromChar: CharacterID) => {
    const [toChar, setToChar] = useState('Tuy Nyao')

    const stats = relManager.getRelation(fromChar, toChar)

    const labels = useMemo(() => {
        if (!stats) return null
        return mapStats(stats)
    }, [stats])

    const updateAffinity = (delta: Partial<Stats>) => {
        relManager.updateAffinity(fromChar, toChar, delta)
    }

    return { toChar, setToChar, stats, labels, updateAffinity }
}