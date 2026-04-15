import { Character, CharacterID } from "interfaces/Realtionships"
import { Stats, StatsLabels } from "interfaces/Stats"
import { useState, useMemo } from "react"
import { Store } from "store"
import { mapStats } from "utils/mapStats"

type UseAffinityStateInitial = { status: 'initial', toChar: null }
type UseAffinityStateChosen = { status: 'chosen', toChar: Character }
type UseAffinityStateNoStats = { status: 'no_stats', toChar: Character }

type UseAffinityInitial = UseAffinityStateInitial & { updateAffinity: null, stats: null, labels: null }
type UseAffinityChosen = UseAffinityStateChosen & { updateAffinity: (delta: Partial<Stats>) => void, stats: Stats, labels: StatsLabels }
type UseAffinityNoStats = UseAffinityStateNoStats & { updateAffinity: null, stats: null, labels: null }

type UseAffinity = UseAffinityInitial | UseAffinityChosen | UseAffinityNoStats
type UseAffinityState = UseAffinityStateChosen | UseAffinityStateInitial

type UseAffinityReturn = UseAffinity & {
    stats: Stats | null
    labels: StatsLabels | null
    setToChar: (toCharId: CharacterID) => void
    createRel: (toCharId: CharacterID) => void
    relOptions: Character[]
}

export const useAffinity = (store: Store, fromChar: CharacterID, characters: Character[]): UseAffinityReturn => {
    const [state, setState] = useState<UseAffinityState>({ status: 'initial', toChar: null })
    const setToChar = (toChar: CharacterID) => {
        setState({
            status: 'chosen',
            toChar: {
                id: toChar,
                name: characters.find(char => char.id === toChar)!.name
            }
        })
    }
    const createRel = (toChar: CharacterID) => {
        store.createRelation(fromChar, toChar)
    }

    const relations = store.relationships[fromChar]
    const relOptions = Object.keys(relations || {}).map(key => ({
        id: key,
        name: characters.find(char => char.id === key)!.name
    }))

    const initialReturn = {
        toChar: null,
        stats: null,
        labels: null,
        updateAffinity: null,
        relOptions: relOptions,
        createRel,
        setToChar
    }

    if (state.status === 'initial') {
        return {
            status: state.status,
            ...initialReturn
        }
    }

    const toChar = state.toChar
    const stats = relations?.[toChar.id] || null

    if (!stats) {
        return {
            ...initialReturn,
            status: "no_stats",
            toChar: toChar
        }
    }

    const labels = mapStats(stats)

    const updateAffinity = (delta: Partial<Stats>) => {
        store.updateRelation(fromChar, toChar.id, delta)
    }

    return { status: state.status, toChar, setToChar, stats, labels, updateAffinity, createRel, relOptions }
}