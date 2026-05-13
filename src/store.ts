import { createRelationshipSlice, RelationshipsSlice } from "slices/relationshipsSlice";
import { create } from "zustand";

export interface ActionStatus {
    success: boolean
    error?: string
}
export type Store = RelationshipsSlice

export const useStore = create<Store>((...a) => ({
    ...createRelationshipSlice(...a)
}))