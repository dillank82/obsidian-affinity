import { RelationshipsManager } from "core/RelationshipsManager"
import { AffinityData } from "interfaces/AffinityData"
import { STAT_MAPS, StatRange, Stats, StatsLabels } from "interfaces/Stats"
import { useState, useMemo } from "react"

interface AffinityDashboardProps {
    rawData: AffinityData | null
}

export const AffinityDashboard = ({ rawData }: AffinityDashboardProps) => {
    const [toChar, setToChar] = useState('Tuy Nyao')

    const relManager = useMemo(() => new RelationshipsManager(rawData || {}), [rawData])

    const stats = useMemo(() => {
        return rawData?.[toChar] || relManager.createRelation(toChar)[toChar] || null
    }, [rawData, toChar, relManager])
    
    //move to a separate file
    const mapStats = (stats: Stats): StatsLabels => {
        const getLabel = (value: number, ranges: readonly StatRange[]): string => {
            const found = ranges.find(r => value >= r.min && value <= r.max)
            return found?.label ?? 'Unknown'
        }
        return {
            affection: getLabel(stats.affection, STAT_MAPS.affection),
            respect: getLabel(stats.respect, STAT_MAPS.respect),
            trust: getLabel(stats.trust, STAT_MAPS.trust),
        }
    }
    const labels = useMemo(() => {
        if (!stats) return null
        return mapStats(stats)
    },[stats])

    if (!labels) {
        return <div>No data found for {toChar}...</div>
    }
    return (
        <>
            <h1>Relation to {toChar}:</h1>
            <ul>
                <li>Affection: {labels.affection}</li>
                <li>Respect: {labels.respect}</li>
                <li>Trust: {labels.trust}</li>
            </ul>
        </>
    )
}