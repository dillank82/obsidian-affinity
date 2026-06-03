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
        switch (status) {
            case 'initial': return <EmptyState />
            case 'chosen': 
                switch(currentView) {
                    case 'main': return <AffinityWorkspace stats={stats} labels={labels} updateAffinity={updateAffinity} />
                    case 'history': return <HistoryWorkspace logsHistory={store.historyMap[fromChar]?.[toChar.id] || []}/>
                }
                break
            case 'no_stats': return <div>No data found for {toChar.name}...</div>
        }
    }

    return (
        <div
            className={styles.dashboardContainer}
            role='region'
            aria-roledescription='application'
            aria-label='Affinity Relationships Tracker'
        >
            <Header
                toChar={toChar}
                fromChar={fromChar}
                setToChar={setToChar}
                charOptions={relOptions}
                createRel={createRel}
                characters={store.chars}
                currentView={currentView}
                setCurrentView={setCurrentView}
            />
            <main aria-live='polite'>
                {renderContent()}
            </main>
        </div>
    )
}