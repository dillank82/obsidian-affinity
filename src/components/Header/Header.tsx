import { CharacterSwitcher } from "components/CharacterSwitcher/CharacterSwitcher"
import { FC } from "react"
import styles from './Header.module.css'
import { RelationsCreator } from "components/RelationsCreator/RelationsCreator"
import { CharacterID } from "interfaces/Realtionships"

interface HeaderProps {
    toChar: {
        name: string;
        id: string;
    } | null
    fromChar: CharacterID
    setToChar: (value: string) => void
    charOptions: { name: string, id: CharacterID }[]
    characters: { name: string, id: CharacterID }[]
    createRel: (charId: CharacterID) => void
}

export const Header: FC<HeaderProps> = ({ toChar, setToChar, charOptions, characters, createRel, fromChar }) => {
    return (
        <header className={styles.header}>
            <h1>{toChar ? `Relation to ${toChar.name}` : 'Affinity'}</h1>
            <CharacterSwitcher currentCharId={toChar?.id || null} onChange={setToChar} options={charOptions} />
            <RelationsCreator fromCharId={fromChar} characters={characters} existingRels={charOptions} onChange={(toChar) => { createRel(toChar); setToChar(toChar) }} />
        </header>
    )
}