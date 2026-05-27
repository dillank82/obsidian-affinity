import { WorkspaceView } from "components/AffinityDashboard/AffinityDashboard"
import { FC } from "react"
import styles from './HistoryButton.module.css'

interface HistoryButtonProps {
    setCurrentView: (view: WorkspaceView) => void
    currentView: WorkspaceView
}

export const HistoryButton: FC<HistoryButtonProps> = ({ setCurrentView, currentView }) => {
    const newView = currentView === 'history' ? 'main' : 'history'
    const isActive = currentView === 'history' ? true : false

    return (
        <button
            onClick={() => { setCurrentView(newView) }}
            className={styles.button}
            data-active={isActive}
            
        >
            <span>H</span>
        </button>
    )
}