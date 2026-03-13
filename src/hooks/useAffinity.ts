import { CharacterID } from "interfaces/Realtionships"
import { Stats } from "interfaces/Stats"
import { useState, useMemo } from "react"
import { Store } from "store"
import { mapStats } from "utils/mapStats"

export const useAffinity = (store: Store, fromChar: CharacterID) => {
    const [toChar, setToChar] = useState('Tuy Nyao')

    const relations = store.relationships[fromChar]
    const stats = relations?.[toChar]
    
    const relOptions = Object.keys(relations || {})

    const labels = useMemo(() => {
        if (!stats) return null
        return mapStats(stats)
    }, [stats])

    const updateAffinity = (delta: Partial<Stats>) => {
        store.updateRelation(fromChar, toChar, delta)
    }

    return { toChar, setToChar, stats, labels, updateAffinity, relOptions }
}