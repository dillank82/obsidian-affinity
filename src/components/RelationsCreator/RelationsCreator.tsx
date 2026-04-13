import { Menu } from "obsidian";
import { FC, useRef } from "react";
import styles from './RelationsCreator.module.css'
import { CharacterID } from "interfaces/Realtionships";

interface RelationsCreatorProps {
    characters: { name: string, id: CharacterID }[]
    existingRels: { name: string, id: CharacterID }[]
    onChange: (char: string) => void
    fromCharId: CharacterID
}

export const RelationsCreator: FC<RelationsCreatorProps> = ({ characters, existingRels, onChange, fromCharId }) => {
    const triggerRef = useRef<HTMLButtonElement>(null)

    const showMenu = () => {
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
                    .onClick(() => onChange(char.id))
            )
        })

        const rect = triggerRef.current?.getBoundingClientRect()
        if (rect) {
            menu.showAtPosition({ x: rect.left, y: rect.bottom })
        }
    }

    return (
        <button 
            ref={triggerRef} 
            onClick={showMenu}
            className={styles.trigger}
        >
            <span>+</span>
        </button>
    )
}