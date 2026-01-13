import { Stats } from "./Stats"

export interface Direction {
    fromChar: string
    toChar: string
}

export interface RelationshipsItem extends Direction {
    stats: Stats
}

export type Relationships = RelationshipsItem[]