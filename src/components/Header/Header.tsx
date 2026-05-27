import { CharacterSwitcher } from "components/CharacterSwitcher/CharacterSwitcher"
import { FC } from "react"
import styles from './Header.module.css'
import { RelationsCreator } from "components/RelationsCreator/RelationsCreator"
import { Character, CharacterID } from "interfaces/Realtionships"
import { HistoryButton } from "components/HistoryButton/HistoryButton"
import { WorkspaceView } from "components/AffinityDashboard/AffinityDashboard"

interface HeaderProps {
    toChar: Character | null
    fromChar: CharacterID
    setToChar: (value: string) => void
    charOptions: Character[]
    characters: Character[]
    createRel: (charId: CharacterID) => void
    setCurrentView: (view: WorkspaceView) => void
    currentView: WorkspaceView
}

export const Header: FC<HeaderProps> = ({ toChar, setToChar, charOptions, characters, createRel, fromChar, setCurrentView, currentView }) => {
    return (
        <header className={styles.header}>
            <h1>{toChar ? `Relation to ${toChar.name}` : 'Affinity'}</h1>
            <CharacterSwitcher currentCharId={toChar?.id || null} onChange={setToChar} options={charOptions} />
            <RelationsCreator fromCharId={fromChar} characters={characters} existingRels={charOptions} onChange={(toChar) => { createRel(toChar); setToChar(toChar) }} />
            <HistoryButton setCurrentView={setCurrentView} currentView={currentView}/>
        </header>
    )
}