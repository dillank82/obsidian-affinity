import styles from './AffinityDashboard.module.css'
import { Character, CharacterID } from "interfaces/Realtionships"
import { Header } from "components/Header/Header"
import { useAffinity } from "hooks/useAffinity"
import { useStore } from "store"
import { AffinityWorkspace } from 'components/AffinityWorkspace/AffinityWorkspace'
import { EmptyState } from 'components/EmptyState/EmptyState'

interface AffinityDashboardProps {
    id: string
    fromChar: CharacterID
    initialToCharId: CharacterID | null
    characters: Character[]
}

export const AffinityDashboard = ({ fromChar, initialToCharId, characters, id }: AffinityDashboardProps) => {
    const store = useStore()
    const { status, toChar, setToChar, stats, labels, updateAffinity, createRel, relOptions } = useAffinity(store, fromChar, initialToCharId, characters, id)

    const renderContent = () => {
        switch(status){
            case 'initial': return <EmptyState />
            case 'chosen': return <AffinityWorkspace stats={stats} labels={labels} updateAffinity={updateAffinity} />
            case 'no_stats': return <div>No data found for {toChar.name}...</div>
        }
    }

    return (
        <div className={styles.dashboardContainer}>
            <Header toChar={toChar} fromChar={fromChar} setToChar={setToChar} charOptions={relOptions} createRel={createRel} characters={characters}/>
            <main>
                {renderContent()}
            </main>
        </div>
    )
}