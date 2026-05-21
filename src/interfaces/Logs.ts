import { CharacterID } from "./Realtionships";
import { Stats } from "./Stats";

export interface Log {
    changes: Partial<Stats>
    // temporarily optional to implement core logic before commenting
    cause?: string
    timestamp: string
}

export type LogsHistory = Record<CharacterID, Log[]>

export type HistoryMap = Record<CharacterID, LogsHistory>