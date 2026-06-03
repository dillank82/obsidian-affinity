import { FC } from "react"
import styles from './LogItem.module.css'

interface LogItemProps {
    affection: {
        value: string
        changeType: 'decreased' | 'unchanged' | 'increased'
    }
    respect: {
        value: string
        changeType: 'decreased' | 'unchanged' | 'increased'
    }
    trust: {
        value: string
        changeType: 'decreased' | 'unchanged' | 'increased'
    }
    timestamp: string
    cause?: string
}

export const LogItem: FC<LogItemProps> = ({ affection, respect, trust, timestamp, cause }) => {

    return (
        <li className={styles.container}>
            <span className={styles.text}>{cause}</span>

            <ul className={styles.changesWrapper}>
                <li className={styles.changeItem}>
                    <span className={styles.hidden}>{`Affection change: ${affection.changeType === 'unchanged' ? 'none' : affection.value}`}</span>
                    <span className={styles[affection.changeType]} aria-hidden={true} aria-label="Affection">
                        {affection.value}
                    </span>
                </li>
                <li className={styles.changeItem}>
                    <span className={styles.hidden}>{`Respect change: ${respect.changeType === 'unchanged' ? 'none' : respect.value}`}</span>
                    <span className={styles[respect.changeType]} aria-hidden={true} aria-label="Respect">
                        {respect.value}
                    </span>
                </li>
                <li className={styles.changeItem}>
                    <span className={styles.hidden}>{`Trust change: ${trust.changeType === 'unchanged' ? 'none' : trust.value}`}</span>
                    <span className={styles[trust.changeType]} aria-hidden={true} aria-label="Trust">
                        {trust.value}
                    </span>
                </li>
            </ul>

            <span className={styles.timestamp}>{timestamp}</span>
        </li>
    )
}