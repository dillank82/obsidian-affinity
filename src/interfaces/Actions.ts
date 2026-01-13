import { Direction } from "./Realtionships"
import { Stats } from "./Stats"

export interface ActionData {
    factor: string
    delta: Stats
}

export interface Action extends ActionData, Direction {}

export interface ActionStamp extends Action {
    time: string
}