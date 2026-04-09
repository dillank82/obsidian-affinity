import { CharacterID } from "interfaces/Realtionships"
import { Stats, StatsLabels } from "interfaces/Stats"
import { useState, useMemo } from "react"
import { Store } from "store"
import { mapStats } from "utils/mapStats"

interface UseAffinityItemsInitial {
    stats: null
    labels: null
    updateAffinity: null
}

interface UseAffinityItemsChosen {
    stats: Stats | null
    labels: StatsLabels | null
    updateAffinity: (delta: Partial<Stats>) => void 
}

type UseAffinityInitial = UseAffinityItemsInitial & UseAffinityStateInitial
type UseAffinityChosen = UseAffinityItemsChosen & UseAffinityStateChosen
type UseAffinity = UseAffinityInitial | UseAffinityChosen

type UseAffinityStateInitial = { status: 'initial', toChar: null }
type UseAffinityStateChosen = { status: 'chosen', toChar: string }

type UseAffinityState = UseAffinityStateChosen | UseAffinityStateInitial

type UseAffinityReturn = UseAffinity & {
    setToChar: (toChar: CharacterID) => void
    relOptions: string[]
}

export const useAffinity = (store: Store, fromChar: CharacterID): UseAffinityReturn => {
    const [state, setState] = useState<UseAffinityState>({ status: 'initial', toChar: null })
    const setToChar = (toChar: CharacterID) => {
        setState({
            status: 'chosen',
            toChar: toChar
        })
    }

    if (state.status === 'initial') {
        return {
            status: state.status,
            toChar: null,
            stats: null,
            labels: null,
            updateAffinity: null,
            relOptions: [],
            setToChar
        }
    }

    const toChar = state.toChar
    const relations = store.relationships[fromChar]
    const stats = relations?.[toChar] || null

    const relOptions = Object.keys(relations || {})

    const labels = useMemo(() => {
        if (!stats) return null
        return mapStats(stats)
    }, [stats])

    const updateAffinity = (delta: Partial<Stats>) => {
        store.updateRelation(fromChar, toChar, delta)
    }

    return { status: state.status, toChar, setToChar, stats, labels, updateAffinity, relOptions }
}