import styles from './AffinityDashboard.module.css'
import { CharacterID } from "interfaces/Realtionships"
import { Header } from "components/Header/Header"
import { useAffinity } from "hooks/useAffinity"
import { useStore } from "store"
import { AffinityWorkspace } from 'components/AffinityWorkspace/AffinityWorkspace'
import { EmptyState } from 'components/EmptyState/EmptyState'
import { useEffect, useRef, useState } from 'react'
import { HistoryWorkspace } from 'components/HistoryWorkspace/HistoryWorkspace'
import { widgetRegistry } from 'widgetFocusRegistry'

interface AffinityDashboardProps {
    id: string
    fromChar: CharacterID
    initialToCharId: CharacterID | null
    pos: number
    filePath: string
}

export type WorkspaceView = 'main' | 'history'

export const AffinityDashboard = ({ fromChar, initialToCharId, id, pos, filePath }: AffinityDashboardProps) => {
    const [currentView, setCurrentView] = useState<WorkspaceView>('main')
    const store = useStore()
    const { status, toChar, setToChar, stats, labels, updateAffinity, createRel, relOptions } = useAffinity(store, fromChar, initialToCharId, id)

    const container = useRef<HTMLDivElement>(null)
    useEffect(() => {
        widgetRegistry.register(id, { el: container.current!, filePath, pos })
    })

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
            ref={container}
            className={styles.dashboardContainer}
            role='region'
            aria-roledescription='application'
            aria-label='Affinity Relationships Tracker'
            tabIndex={-1}
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
                codeBlockId={id}
            />
            <main aria-live='polite'>
                {renderContent()}
            </main>
        </div>
    )
}