export type Stat = number

export type StatKey = 'affection' | 'respect' | 'trust'

export type Stats = {
    [key in StatKey]: Stat
}