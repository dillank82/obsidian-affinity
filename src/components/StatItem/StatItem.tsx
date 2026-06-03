import { StatScale } from "components/StatScale/StatScale"
import { FC, useId } from "react"
import styles from './StatItem.module.css'

interface StatItemProps {
    statValue: number
    statKey: string
    label: string
}

export const StatItem: FC<StatItemProps> = ({ statValue, label, statKey }) => {
    const statNameId = useId()
    return (
        <>
            <div className={styles.label}>
                <span className={styles.statKey} id={statNameId}>{statKey}:</span>
                <span className={styles.statValue}>{label}</span>
            </div>
            <StatScale value={statValue} labelledBy={statNameId}/>
        </>
    )
}