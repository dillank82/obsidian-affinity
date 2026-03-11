import { RelationshipsManager } from "core/RelationshipsManager"
import { StatScale } from "../StatScale/StatScale"
import styles from './AffinityDashboard.module.css'
import { ChangeAffinityForm } from "components/ChangeAffinityForm/ChangeAffinityForm"
import { VerticalDivider } from "components/VerticalDivider/VerticalDivider"
import { CharacterID } from "interfaces/Realtionships"
import { Header } from "components/Header/Header"
import { useAffinity } from "hooks/useAffinity"

interface AffinityDashboardProps {
    relManager: RelationshipsManager
    fromChar: CharacterID
}

export const AffinityDashboard = ({ relManager, fromChar }: AffinityDashboardProps) => {
    const { toChar, setToChar, stats, labels, updateAffinity } = useAffinity(relManager, fromChar)

    if (!labels) {
        return <div>No data found for {toChar}...</div>
    }

    return (
        <div className={styles.dashboardContainer}>
            <Header toChar={toChar} setToChar={setToChar} charOptions={Object.keys(relManager.store.relationships[fromChar] || {})}/>
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