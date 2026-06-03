import { Log } from "interfaces/Logs"
import { FC } from "react"
import styles from './HistoryWorkspace.module.css'
import { LogItem } from "components/LogItem/LogItem"

interface HistoryWorkspaceProps {
    logsHistory: Log[]
}

export const HistoryWorkspace: FC<HistoryWorkspaceProps> = ({ logsHistory }) => {
    const sortedLogs = [...logsHistory].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    const normalizeChangesValue = (value: number | undefined): { value: string, changeType: 'decreased' | 'unchanged' | 'increased' } => {
        const res: { value: string, changeType: 'decreased' | 'unchanged' | 'increased' } = { value: '-', changeType: 'unchanged' }
        if (!value) return res
        if (value > 0) {
            res.value = `+${value}`
            res.changeType = 'increased'
        } else {
            res.value = String(value)
            res.changeType = 'decreased'
        }
        return res
    }

    return (
        <ul className={styles.container}>
            {
                sortedLogs.map((log) => (
                    <LogItem
                        affection={normalizeChangesValue(log.changes.affection)}
                        respect={normalizeChangesValue(log.changes.respect)}
                        trust={normalizeChangesValue(log.changes.trust)}
                        timestamp={log.timestamp}
                        cause={log.cause}
                    />
                ))
            }
        </ul>
    )
}