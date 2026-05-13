import { Character } from "interfaces/Realtionships"
import { StateCreator } from "zustand"

export interface CharacterSlice {
    chars: Character[]
    setChars: (chars: Character[]) => void
}

export const createCharacterSlice: StateCreator<CharacterSlice> = (set) => ({
    chars: [],
    setChars: (chars) => set({ chars })
})