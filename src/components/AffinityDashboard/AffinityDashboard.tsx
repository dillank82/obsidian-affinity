import styles from './AffinityDashboard.module.css'
import { CharacterID } from "interfaces/Realtionships"
import { Header } from "components/Header/Header"
import { useAffinity } from "hooks/useAffinity"
import { useStore } from "store"
import { AffinityWorkspace } from 'components/AffinityWorkspace/AffinityWorkspace'
import { EmptyState } from 'components/EmptyState/EmptyState'

interface AffinityDashboardProps {
    fromChar: CharacterID
}

export const AffinityDashboard = ({ fromChar }: AffinityDashboardProps) => {
    const store = useStore()
    const { toChar, setToChar, stats, labels, updateAffinity, relOptions } = useAffinity(store, fromChar)

    const renderContent = () => {
        if (!toChar) {
            return <EmptyState />
        } else if (!(stats && labels)) {
            return <div>No data found for {toChar}...</div>
        } else {
            return <AffinityWorkspace stats={stats} labels={labels} updateAffinity={updateAffinity} />
        }
    }

    return (
        <div className={styles.dashboardContainer}>
            <Header toChar={toChar} setToChar={setToChar} charOptions={Object.keys(relOptions)}/>
            <main>
                {renderContent()}
            </main>
        </div>
    )
}