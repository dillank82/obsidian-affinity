import { ChangeAffinityForm } from "components/ChangeAffinityForm/ChangeAffinityForm"
import { StatItem } from "components/StatItem/StatItem"
import { VerticalDivider } from "components/VerticalDivider/VerticalDivider"
import { Stats, StatsLabels } from "interfaces/Stats"
import { FC } from "react"
import styles from './AffinityWorkspace.module.css'
import { UpdateAffinity } from "interfaces/useAffinity"

interface AffinityWorkspaceProps {
    stats: Stats
    labels: StatsLabels
    updateAffinity: UpdateAffinity
}

export const AffinityWorkspace: FC<AffinityWorkspaceProps> = ({ stats, labels, updateAffinity }) => {
    return (
        <>
            <ul className={styles.statsBlock}>
                <StatItem statValue={stats?.affection || 0} label={labels.affection} statKey="Affection" />
                <VerticalDivider />
                <StatItem statValue={stats?.respect || 0} label={labels.respect} statKey="Respect" />
                <VerticalDivider />
                <StatItem statValue={stats?.trust || 0} label={labels.trust} statKey="Trust" />
            </ul>
            <ChangeAffinityForm updateAffinity={updateAffinity} />
        </>
    )
}

