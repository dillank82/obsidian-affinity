import { StatKey, Stats } from "./Stats"
import { OptionalStrings } from "./utils"

export type AffinityFormState = OptionalStrings<Stats> & { cause?: string }
export type AffinityFormValue = AffinityFormState[StatKey | 'cause']