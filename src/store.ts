import { CharacterSlice, createCharacterSlice } from "slices/charactersSlice";
import { createHistorySlice, HistorySlice } from "slices/historySlice";
import { createRelationshipSlice, RelationshipsSlice } from "slices/relationshipsSlice";
import { create } from "zustand";

export interface ActionStatus {
    success: boolean
    error?: string
}
export type Store = RelationshipsSlice & CharacterSlice & HistorySlice

export const useStore = create<Store>((...a) => ({
    ...createRelationshipSlice(...a),
    ...createCharacterSlice(...a),
    ...createHistorySlice(...a)
}))