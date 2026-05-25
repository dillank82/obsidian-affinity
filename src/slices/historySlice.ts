import { HistoryMap, Log } from "interfaces/Logs"
import { CharacterID } from "interfaces/Realtionships"
import { StateCreator } from "zustand"

export interface HistorySlice {
    historyMap: HistoryMap
    addLog: (fromId: CharacterID, toId: CharacterID, log: Log) => void
}

export const createHistorySlice: StateCreator<HistorySlice> = (set) => ({
    historyMap: {},
    addLog: (fromId, toId, log) => set(state => ({
        ...state,
        historyMap: {
            ...state.historyMap,
            [fromId]: {
                ...state.historyMap[fromId],
                [toId]: [...(state.historyMap[fromId]?.[toId] || []), log]
            }
        }
    }))
})