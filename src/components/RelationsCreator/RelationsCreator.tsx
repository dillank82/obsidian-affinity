import { Menu } from "obsidian";
import { FC, useRef, useState } from "react";
import styles from './RelationsCreator.module.css'
import { Character, CharacterID } from "interfaces/Realtionships";

interface RelationsCreatorProps {
    characters: Character[]
    existingRels: Character[]
    onChange: (char: string) => Promise<void>
    fromCharId: CharacterID
}

export const RelationsCreator: FC<RelationsCreatorProps> = ({ characters, existingRels, onChange, fromCharId }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const triggerRef = useRef<HTMLButtonElement>(null)

    const showMenu = () => {
        setIsOpen(true)
        const menu = new Menu()

        if (characters.length === 0) {
            menu.addItem(item => 
                item
                    .setTitle('No other characters found')
                    .setDisabled(true)
            )
        }

        characters.filter(char => char.id !== fromCharId).forEach((char) => {
            const created = Boolean(existingRels.find(rel => rel.id === char.id))
            menu.addItem((item) =>
                item
                    .setTitle(char.name)
                    .setChecked(created).setDisabled(created)
                    .onClick(async () => await onChange(char.id))
            )
        })

        const rect = triggerRef.current?.getBoundingClientRect()
        if (rect) {
            menu.showAtPosition({ x: rect.left, y: rect.bottom })
        }

        menu.onHide(() => { setIsOpen(false) })
    }

    return (
        <button 
            ref={triggerRef} 
            onClick={showMenu}
            className={styles.trigger}
            aria-label="Create new relation"
            aria-haspopup={true}
            aria-expanded={isOpen}
        >
            <span aria-hidden={true}>+</span>
        </button>
    )
}