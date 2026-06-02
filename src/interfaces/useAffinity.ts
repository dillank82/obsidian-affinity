import { Character, CharacterID } from "./Realtionships"
import { Stats, StatsLabels } from "./Stats"

export type UpdateAffinity = (delta: Partial<Stats>, cause?: string) => void

type InitialState = { status: 'initial', toChar: null }
type ChosenState = { status: 'chosen', toChar: Character }
type NoStatsState = { status: 'no_stats', toChar: Character }

type EmptyData = {
    updateAffinity: null
    stats: null
    labels: null
}
type ChosenData = {
    updateAffinity: UpdateAffinity
    stats: Stats
    labels: StatsLabels
}

type InitialReturn = InitialState & EmptyData
type NoStatsReturn = NoStatsState & EmptyData
type ChosenReturn = ChosenState & ChosenData

type StatusReturn = InitialReturn | ChosenReturn | NoStatsReturn

export type UseAffinityState = ChosenState | InitialState

export type UseAffinityReturn = StatusReturn & {
    setToChar: (toCharId: CharacterID) => void
    createRel: (toCharId: CharacterID) => void
    relOptions: Character[]
}