import { CharacterID } from "interfaces/Realtionships"
import { Stats, StatsLabels } from "interfaces/Stats"
import { useState, useMemo } from "react"
import { Store } from "store"
import { mapStats } from "utils/mapStats"

type UseAffinityStateInitial = { status: 'initial', toChar: null }
type UseAffinityStateChosen = { status: 'chosen', toChar: string }

type UseAffinityInitial = UseAffinityStateInitial & { updateAffinity: null }
type UseAffinityChosen = UseAffinityStateChosen & { updateAffinity: (delta: Partial<Stats>) => void }

type UseAffinity = UseAffinityInitial | UseAffinityChosen
type UseAffinityState = UseAffinityStateChosen | UseAffinityStateInitial

type UseAffinityReturn = UseAffinity & {
    stats: Stats | null
    labels: StatsLabels | null
    setToChar: (toChar: CharacterID) => void
    createRel: (toChar: CharacterID) => void
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
    const createRel = (toChar: CharacterID) => {
        store.createRelation(fromChar, toChar)
    }

    if (state.status === 'initial') {
        return {
            status: state.status,
            toChar: null,
            stats: null,
            labels: null,
            updateAffinity: null,
            relOptions: [],
            createRel,
            setToChar
        }
    }

    const toChar = state.toChar
    const relations = store.relationships[fromChar]
    const stats = relations?.[toChar] || null

    const labels = stats ? mapStats(stats) : null

    const relOptions = Object.keys(relations || {})


    const updateAffinity = (delta: Partial<Stats>) => {
        store.updateRelation(fromChar, toChar, delta)
    }

    return { status: state.status, toChar, setToChar, stats, labels, updateAffinity, createRel, relOptions }
}