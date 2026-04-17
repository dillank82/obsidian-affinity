import { Character, CharacterID } from "interfaces/Realtionships"
import { Stats } from "interfaces/Stats"
import { UseAffinityReturn, UseAffinityState } from "interfaces/useAffinity"
import { useState } from "react"
import { Store } from "store"
import { mapStats } from "utils/mapStats"

export const useAffinity = (store: Store, fromChar: CharacterID, initialToCharId: CharacterID | null, characters: Character[]): UseAffinityReturn => {
    const getInitialToChar = () => {
        if (!initialToCharId) return null
        const name = characters.find(char => char.id === initialToCharId)?.name
        if (!name) return null
        return {
            id: initialToCharId,
            name: name
        }
    }
    const getInitialState = (): UseAffinityState => {
        const toChar = getInitialToChar()
        if (!toChar) {
            return {
                status: 'initial',
                toChar
            }
        } else {
            return {
                status: 'chosen',
                toChar
            }
        }
    }
    const [state, setState] = useState<UseAffinityState>(getInitialState())
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