import { RelationshipsManager } from "core/RelationshipsManager"
import { Stats } from "interfaces/Stats"
import { useState, useMemo } from "react"
import { StatScale } from "../StatScale/StatScale"
import styles from './AffinityDashboard.module.css'
import { ChangeAffinityForm } from "components/ChangeAffinityForm/ChangeAffinityForm"
import { VerticalDivider } from "components/VerticalDivider/VerticalDivider"
import { CharacterSwitcher } from "components/CharacterSwitcher/CharacterSwitcher"
import { CharacterID } from "interfaces/Realtionships"
import { mapStats } from "utils/mapStats"

interface AffinityDashboardProps {
    relManager: RelationshipsManager
    fromChar: CharacterID
}

export const AffinityDashboard = ({ relManager, fromChar }: AffinityDashboardProps) => {
    const [toChar, setToChar] = useState('Tuy Nyao')

    const stats = relManager.getRelation(fromChar, toChar)
    
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
                <CharacterSwitcher currentChar={toChar} onChange={setToChar} options={Object.keys(relManager.store.relationships[fromChar] || {})}/>
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