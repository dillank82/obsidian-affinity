import { RelationshipsManager } from "core/RelationshipsManager"
import styles from './AffinityDashboard.module.css'
import { ChangeAffinityForm } from "components/ChangeAffinityForm/ChangeAffinityForm"
import { VerticalDivider } from "components/VerticalDivider/VerticalDivider"
import { CharacterID } from "interfaces/Realtionships"
import { Header } from "components/Header/Header"
import { useAffinity } from "hooks/useAffinity"
import { StatItem } from "components/StatItem/StatItem"

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
                    <StatItem statValue={stats?.affection || 0} label={labels.affection} statKey="Affection" />
                    <VerticalDivider />
                    <StatItem statValue={stats?.respect || 0} label={labels.respect} statKey="Respect" />
                    <VerticalDivider />
                    <StatItem statValue={stats?.trust || 0} label={labels.trust} statKey="Trust" />
                </ul>
                <ChangeAffinityForm updateAffinity={updateAffinity}/>
            </main>
        </div>
    )
}