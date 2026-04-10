import { Menu } from "obsidian";
import { FC, useRef } from "react";
import styles from './RelationsCreator.module.css'

interface RelationsCreatorProps {
    characters: string[]
    existingRels: string[]
    onChange: (char: string) => void
}

export const RelationsCreator: FC<RelationsCreatorProps> = ({ characters, existingRels, onChange }) => {
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

        characters.forEach((char) => {
            menu.addItem((item) =>
                item
                    .setTitle(char)
                    .setChecked(existingRels.contains(char))
                    .onClick(() => onChange(char))
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