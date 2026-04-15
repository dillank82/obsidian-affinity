import { Stats } from "./Stats"

export type CharacterID = string

export interface Character {
    id: CharacterID
    name: string
}

type fromChar = CharacterID
type toChar = CharacterID
export type Relationships = Record<fromChar, Record<toChar, Stats>>