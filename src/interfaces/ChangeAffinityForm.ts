import { StatKey, Stats } from "./Stats"
import { String } from "./utils"

export type AffinityFormState = String<Stats> & { cause: string }
export type AffinityFormValue = AffinityFormState[StatKey | 'cause']