import { StatKey, Stats } from "./Stats"
import { OptionalStrings } from "./utils"

export type AffinityFormState = OptionalStrings<Stats>
export type AffinityFormValue = AffinityFormState[StatKey]