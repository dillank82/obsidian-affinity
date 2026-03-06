import { CharacterID, Relationships } from "interfaces/Realtionships";
import { Stats } from "interfaces/Stats";
import { create } from "zustand";

interface StoreActions {
    setRelation: (from: CharacterID, to: CharacterID, newRel: Stats) => void
}
interface StoreState {
    relationships: Relationships
}
export type Store = StoreActions & StoreState

export const useStore = create<Store>((set) => ({
    relationships: {},
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
export const storeApi = useStore.getState()