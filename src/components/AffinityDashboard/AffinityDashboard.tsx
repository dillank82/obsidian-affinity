import styles from './AffinityDashboard.module.css'
import { CharacterID } from "interfaces/Realtionships"
import { Header } from "components/Header/Header"
import { useAffinity } from "hooks/useAffinity"
import { useStore } from "store"
import { AffinityWorkspace } from 'components/AffinityWorkspace/AffinityWorkspace'
import { EmptyState } from 'components/EmptyState/EmptyState'
import { useState } from 'react'
import { HistoryWorkspace } from 'components/HistoryWorkspace/HistoryWorkspace'

interface AffinityDashboardProps {
    id: string
    fromChar: CharacterID
    initialToCharId: CharacterID | null
}

export type WorkspaceView = 'main' | 'history'

export const AffinityDashboard = ({ fromChar, initialToCharId, id }: AffinityDashboardProps) => {
    const [currentView, setCurrentView] = useState<WorkspaceView>('main')
    const store = useStore()
    const { status, toChar, setToChar, stats, labels, updateAffinity, createRel, relOptions } = useAffinity(store, fromChar, initialToCharId, id)

    const renderContent = () => {
        switch (currentView) {
            case 'main':
                switch (status) {
                    case 'initial': return <EmptyState />
                    case 'chosen': return <AffinityWorkspace stats={stats} labels={labels} updateAffinity={updateAffinity} />
                    case 'no_stats': return <div>No data found for {toChar.name}...</div>
                }
                break
            case 'history': return <HistoryWorkspace />
        }

    }

    return (
        <div className={styles.dashboardContainer}>
            <Header
                toChar={toChar}
                fromChar={fromChar}
                setToChar={setToChar}
                charOptions={relOptions}
                createRel={createRel}
                characters={store.chars}
                setCurrentView={setCurrentView}
            />
            <main>
                {renderContent()}
            </main>
        </div>
    )
}