import { Log } from "interfaces/Logs"
import { FC } from "react"
import styles from './HistoryWorkspace.module.css'

interface HistoryWorkspaceProps {
    logsHistory: Log[]
}

export const HistoryWorkspace: FC<HistoryWorkspaceProps> = ({ logsHistory }) => {
    const sortedLogs = [...logsHistory].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    const normalizeChangesValue = (value: number | undefined): string => {
        if (!value) return '-'
        else if (value > 0) return `+${value}`
        else return String(value)
    }

    return(
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>
                            <span className={styles.letter}>A</span>
                            <span className={styles.headDivider}>|</span>
                            <span className={styles.letter}>R</span>
                            <span className={styles.headDivider}>|</span>
                            <span className={styles.letter}>T</span>
                        </th>
                        <th>
                            Cause
                        </th>
                        <th>
                            Timestamp
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedLogs.map((log) => (
                        <tr key={log.timestamp}>
                            <td>
                                <span>{normalizeChangesValue(log.changes.affection)}</span>
                                <span className={styles.changesDivider}>|</span>
                                <span>{normalizeChangesValue(log.changes.respect)}</span>
                                <span className={styles.changesDivider}>|</span>
                                <span>{normalizeChangesValue(log.changes.trust)}</span>
                            </td>
                            <td>
                                {log.cause || '-'}
                            </td>
                            <td>
                                {log.timestamp}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}