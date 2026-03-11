import { CharacterSwitcher } from "components/CharacterSwitcher/CharacterSwitcher"
import { FC } from "react"
import styles from './Header.module.css'

interface HeaderProps {
    toChar: string
    setToChar: (value: string) => void
    charOptions: string[]
}

export const Header: FC<HeaderProps> = ({ toChar, setToChar, charOptions }) => {
    return (
        <header className={styles.header}>
            <h1>Relation to {toChar}</h1>
            <CharacterSwitcher currentChar={toChar} onChange={setToChar} options={charOptions} />
        </header>
    )
}