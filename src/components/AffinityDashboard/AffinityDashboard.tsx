import { RelationshipsManager } from "core/RelationshipsManager"
import { STAT_MAPS, StatRange, Stats, StatsLabels } from "interfaces/Stats"
import { useState, useMemo } from "react"
import { StatScale } from "../StatScale/StatScale"
import styles from './AffinityDashboard.module.css'
import { ChangeAffinityForm } from "components/ChangeAffinityForm/ChangeAffinityForm"
import { VerticalDivider } from "components/VerticalDivider/VerticalDivider"
import { CharacterSwitcher } from "components/CharacterSwitcher/CharacterSwitcher"
import { CharacterID } from "interfaces/Realtionships"
import { Store } from "store"

interface AffinityDashboardProps {
    relManager: RelationshipsManager
    fromChar: CharacterID
    store: Store
}

export const AffinityDashboard = ({ relManager, fromChar, store }: AffinityDashboardProps) => {
    const [toChar, setToChar] = useState('Tuy Nyao')

    const stats = relManager.getRelation(fromChar, toChar)
    
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

    const updateAffinity = (delta: Partial<Stats>) => {
        relManager.updateAffinity(fromChar, toChar, delta)
    }

    if (!labels) {
        return <div>No data found for {toChar}...</div>
    }

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1>Relation to {toChar}</h1>
                <CharacterSwitcher currentChar={toChar} onChange={setToChar} options={Object.keys(store.relationships[fromChar] || {})}/>
            </header>
            <main>
                <ul className={styles.statsBlock}>
                    <li className={styles.scaleContainer}>
                        <div className={styles.statLabel}>
                            <span className={styles.statKey}>Affection:</span>
                            <span className={styles.statValue}>{labels.affection}</span>
                        </div>
                        <StatScale value={stats?.affection || 0}/>
                    </li>
                    <VerticalDivider />
                    <li className={styles.scaleContainer}>
                        <div className={styles.statLabel}>
                            <span className={styles.statKey}>Respect:</span>
                            <span className={styles.statValue}>{labels.respect}</span>
                        </div>
                        <StatScale value={stats?.respect || 0}/>
                    </li>
                    <VerticalDivider />
                    <li className={styles.scaleContainer}>
                        <div className={styles.statLabel}>
                            <span className={styles.statKey}>Trust:</span>
                            <span className={styles.statValue}>{labels.trust}</span>
                        </div>
                        <StatScale value={stats?.trust || 0}/>
                    </li>
                </ul>
                <ChangeAffinityForm updateAffinity={updateAffinity}/>
            </main>
        </div>
    )
}