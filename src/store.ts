import { CharacterID, Relationships } from "interfaces/Realtionships";
import { StatKey, Stats } from "interfaces/Stats";
import { updateAffinity } from "utils/updateAffinity/updateAffinity";
import { create } from "zustand";

interface ActionStatus {
    success: boolean
    error?: string
}
type UpdateRelationResult = Record<StatKey, { value: number, change: number, status: string }>

export interface StoreActions {
    getRelation: (from: CharacterID, to: CharacterID) => Stats | null
    createRelation: (from: CharacterID, to: CharacterID) => ActionStatus
    updateRelation: (from: CharacterID, to: CharacterID, delta: Partial<Stats>) => ActionStatus & { result?: UpdateRelationResult }
    setRelation: (from: CharacterID, to: CharacterID, newRel: Stats) => void
}
interface StoreState {
    relationships: Relationships
}
export type Store = StoreActions & StoreState

export const useStore = create<Store>((set, get) => ({
    relationships: {},
    getRelation: (from, to) => get().relationships[from]?.[to] || null,
    createRelation: (from, to) => {
        const rel = get().getRelation(from, to)
        if (rel) return { success: false, error: 'This relation already exists' }

        const initialStatsValue = 10
        const newRel: Stats = { affection: initialStatsValue, respect: initialStatsValue, trust: initialStatsValue }
        const setRelation = get().setRelation
        setRelation(from, to, newRel)
        return { success: true }
    },
    updateRelation: (from, to, delta) => {
        const rel = get().getRelation(from, to)
        if (!rel) return { success: false, error: 'Relation not found' }
        
        const { newRel, result } = updateAffinity(rel, delta)
        const setRelation = get().setRelation
        setRelation(from, to, newRel)
        return { success: true, result }
    },
    setRelation: (from, to, newRel) => set((state) => ({
        relationships: {
            ...state.relationships,
            [from]: {
                ...state.relationships[from],
                [to]: newRel
            }
        }
    }))
}))