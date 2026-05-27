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
        <div className={styles.container}>
            <span className={styles.text}>{cause}</span>

            <div className={styles.changesWrapper}>
                <span className={styles[affection.changeType]}>
                    {affection.value}
                </span>
                <span className={styles[respect.changeType]}>
                    {respect.value}
                </span>
                <span className={styles[trust.changeType]}>
                    {trust.value}
                </span>
            </div>

            <span className={styles.timestamp}>{timestamp}</span>
        </div>
    )
}