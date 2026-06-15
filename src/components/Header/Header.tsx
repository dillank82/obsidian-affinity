import { CharacterSwitcher } from "components/CharacterSwitcher/CharacterSwitcher"
import { FC } from "react"
import styles from './Header.module.css'
import { RelationsCreator } from "components/RelationsCreator/RelationsCreator"
import { Character, CharacterID } from "interfaces/Realtionships"
import { HistoryButton } from "components/HistoryButton/HistoryButton"
import { WorkspaceView } from "components/AffinityDashboard/AffinityDashboard"
import { DeleteButton } from "components/DeleteButton/DeleteButton"

interface HeaderProps {
    toChar: Character | null
    fromChar: CharacterID
    setToChar: (value: string) => void
    charOptions: Character[]
    characters: Character[]
    createRel: (charId: CharacterID) => void
    setCurrentView: (view: WorkspaceView) => void
    currentView: WorkspaceView
    codeBlockId: string
}

export const Header: FC<HeaderProps> = ({ toChar, setToChar, charOptions, characters, createRel, fromChar, setCurrentView, currentView, codeBlockId }) => {
    return (
        <header className={styles.header}>
            <span aria-atomic="true" className={styles.currentChar}>{toChar ? `Relation to ${toChar.name}` : 'Affinity'}</span>
            <nav>
                <CharacterSwitcher currentCharId={toChar?.id || null} onChange={setToChar} options={charOptions} />
                <RelationsCreator fromCharId={fromChar} characters={characters} existingRels={charOptions} onChange={(toChar) => { createRel(toChar); setToChar(toChar) }} />
                <HistoryButton setCurrentView={setCurrentView} currentView={currentView}/>
                <DeleteButton codeBlockId={codeBlockId}/>
            </nav>
        </header>
    )
}