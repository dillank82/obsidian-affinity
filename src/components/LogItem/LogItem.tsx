import { FC, useEffect, useRef } from "react"
import styles from './LogItem.module.css'
import { setTooltip } from "obsidian"

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
    const affectionRef = useRef<HTMLElement>(null)
    const respectRef = useRef<HTMLElement>(null)
    const trustRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (affectionRef.current) setTooltip(affectionRef.current, 'Affection')
        if (respectRef.current) setTooltip(respectRef.current, 'Respect')
        if (trustRef.current) setTooltip(trustRef.current, 'Trust')
    }, [])

    return (
        <div className={styles.container}>
            <span className={styles.text}>{cause}</span>

            <div className={styles.changesWrapper}>
                <span className={styles[affection.changeType]} ref={affectionRef}>
                    {affection.value}
                </span>
                <span className={styles[respect.changeType]} ref={respectRef}>
                    {respect.value}
                </span>
                <span className={styles[trust.changeType]} ref={trustRef}>
                    {trust.value}
                </span>
            </div>

            <span className={styles.timestamp}>{timestamp}</span>
        </div>
    )
}