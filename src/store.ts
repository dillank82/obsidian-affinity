import { CharacterSlice, createCharacterSlice } from "slices/charactersSlice";
import { createRelationshipSlice, RelationshipsSlice } from "slices/relationshipsSlice";
import { create } from "zustand";

export interface ActionStatus {
    success: boolean
    error?: string
}
export type Store = RelationshipsSlice & CharacterSlice

export const useStore = create<Store>((...a) => ({
    ...createRelationshipSlice(...a),
    ...createCharacterSlice(...a)
}))