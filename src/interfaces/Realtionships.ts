import { Stats } from "./Stats"

export type CharacterID = string

export interface Character {
    id: CharacterID
    name: string
}

export interface Direction {
    fromChar: string
    toChar: string
}

export interface RelationshipsItem extends Direction {
    stats: Stats
}

type fromChar = CharacterID
type toChar = CharacterID
export type Relationships = Record<fromChar, Record<toChar, Stats>>