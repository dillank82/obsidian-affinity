import styles from './AffinityDashboard.module.css'
import { Character, CharacterID } from "interfaces/Realtionships"
import { Header } from "components/Header/Header"
import { useAffinity } from "hooks/useAffinity"
import { useStore } from "store"
import { AffinityWorkspace } from 'components/AffinityWorkspace/AffinityWorkspace'
import { EmptyState } from 'components/EmptyState/EmptyState'

interface AffinityDashboardProps {
    fromChar: CharacterID
    characters: Character[]
}

export const AffinityDashboard = ({ fromChar, characters }: AffinityDashboardProps) => {
    const store = useStore()
    const { toChar, setToChar, stats, labels, updateAffinity, createRel, relOptions } = useAffinity(store, fromChar, characters)

    const renderContent = () => {
        if (!toChar) {
            return <EmptyState />
        } else if (!(stats && labels)) {
            return <div>No data found for {toChar.name}...</div>
        } else {
            return <AffinityWorkspace stats={stats} labels={labels} updateAffinity={updateAffinity} />
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