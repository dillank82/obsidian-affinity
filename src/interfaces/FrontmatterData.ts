import { RelationshipsItem } from "./Realtionships"

export interface FrontmatterData {
    affinityData: {
        name: string
        relationships: FrontmatterRelation[]
    }
}

type FrontmatterRelation = Omit<RelationshipsItem, 'fromChar'>