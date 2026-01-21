export const STAT_NAMES = ['affection', 'respect', 'trust'] as const

export type StatKey = typeof STAT_NAMES[number]

export type Stat = number


export type Stats = {
    [key in StatKey]: Stat
}