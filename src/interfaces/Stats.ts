export const STAT_NAMES = ['affection', 'respect', 'trust'] as const

export type StatKey = typeof STAT_NAMES[number]

export type Stat = number


export type Stats = {
    [key in StatKey]: Stat
}

export interface StatRange {
    label: string
    min: number
    max: number
}

export const STAT_MAPS = {
    affection: [
        { label: "Repulsion", min: 1, max: 4 },
        { label: "Detachment", min: 5, max: 8 },
        { label: "Neutrality", min: 9, max: 12 },
        { label: "Affinity", min: 13, max: 16 },
        { label: "Devotion", min: 17, max: 20 },
    ],
    respect: [
        { label: "Contempt", min: 1, max: 4 },
        { label: "Skepticism", min: 5, max: 8 },
        { label: "Recognition", min: 9, max: 12 },
        { label: "Esteem", min: 13, max: 16 },
        { label: "Veneration", min: 17, max: 20 },
    ],
    trust: [
        { label: "Hostility", min: 1, max: 4 },
        { label: "Wariness", min: 5, max: 8 },
        { label: "Accord", min: 9, max: 12 },
        { label: "Confidence", min: 13, max: 16 },
        { label: "Vulnerability", min: 17, max: 20 },
    ],
} as const

export type StatsLabels = {
    [K in keyof Stats]: string
}
