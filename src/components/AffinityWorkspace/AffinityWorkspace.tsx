import { ChangeAffinityForm } from "components/ChangeAffinityForm/ChangeAffinityForm"
import { StatItem } from "components/StatItem/StatItem"
import { VerticalDivider } from "components/VerticalDivider/VerticalDivider"
import { Stats, StatsLabels } from "interfaces/Stats"
import { FC } from "react"
import styles from './AffinityWorkspace.module.css'
import { UpdateAffinity } from "interfaces/useAffinity"
import { Notice } from "obsidian"

interface AffinityWorkspaceProps {
    stats: Stats
    labels: StatsLabels
    updateAffinity: UpdateAffinity
}

export const AffinityWorkspace: FC<AffinityWorkspaceProps> = ({ stats, labels, updateAffinity }) => {
    return (
        <>
            <ul className={styles.statsBlock}>
                <li className={styles.statItemContainer}>
                    <StatItem statValue={stats?.affection || 0} label={labels.affection} statKey="Affection" />
                </li>
                <VerticalDivider />
                <li className={styles.statItemContainer}>
                    <StatItem statValue={stats?.respect || 0} label={labels.respect} statKey="Respect" />
                </li>
                <VerticalDivider />
                <li className={styles.statItemContainer}>
                    <StatItem statValue={stats?.trust || 0} label={labels.trust} statKey="Trust" />
                </li>
            </ul>
            <ChangeAffinityForm updateAffinity={updateAffinity} onError={(msg) => new Notice(msg)}/>
        </>
    )
}

