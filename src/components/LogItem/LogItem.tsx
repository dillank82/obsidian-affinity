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

            <ul className={styles.changesWrapper}>
                <li aria-label={`Affection change: ${affection.value}`}>
                    <span className={styles[affection.changeType]} ref={affectionRef}>
                        {affection.value}
                    </span>
                </li>
                <li aria-label={`Respect change: ${respect.value}`}>
                    <span className={styles[respect.changeType]} ref={respectRef}>
                        {respect.value}
                    </span>
                </li>
                <li aria-label={`Trust change: ${trust.value}`}>
                    <span className={styles[trust.changeType]} ref={trustRef}>
                        {trust.value}
                    </span>
                </li>
            </ul>

            <span className={styles.timestamp}>{timestamp}</span>
        </div>
    )
}