import { Log } from "interfaces/Logs"
import { FC } from "react"

interface HistoryWorkspaceProps {
    logsHistory: Log[]
}

export const HistoryWorkspace: FC<HistoryWorkspaceProps> = ({ logsHistory }) => {
    const sortedLogs = [...logsHistory].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    return(
        <table>
            <thead>
                <tr>
                    <th>
                        A|R|T
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
                            <span>{log.changes.affection || '-'}</span>
                            <span>{log.changes.respect || '-'}</span>
                            <span>{log.changes.trust || '-'}</span>
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
    )
}