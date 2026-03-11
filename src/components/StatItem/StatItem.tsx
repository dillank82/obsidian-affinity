import { StatScale } from "components/StatScale/StatScale"
import { FC } from "react"
import styles from './StatItem.module.css'

interface StatItemProps {
    statValue: number
    statKey: string
    label: string
}

export const StatItem: FC<StatItemProps> = ({ statValue, label, statKey }) => {
    return (
        <li className={styles.container}>
            <div className={styles.label}>
                <span className={styles.statKey}>{statKey}:</span>
                <span className={styles.statValue}>{label}</span>
            </div>
            <StatScale value={statValue} />
        </li>
    )
}