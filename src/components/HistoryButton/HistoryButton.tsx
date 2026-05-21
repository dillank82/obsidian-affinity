import { WorkspaceView } from "components/AffinityDashboard/AffinityDashboard"
import { FC } from "react"

interface HistoryButtonProps {
    setCurrentView: (view: WorkspaceView) => void
}

export const HistoryButton: FC<HistoryButtonProps> = ({ setCurrentView }) => {

    return (
        <button
            onClick={() => { setCurrentView('history') }}
        >
            <span>H</span>
        </button>
    )
}