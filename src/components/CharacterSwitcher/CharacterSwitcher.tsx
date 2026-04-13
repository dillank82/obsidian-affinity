import { FC, useRef } from "react"
import { Menu } from "obsidian"
import styles from './CharacterSwitcher.module.css'
import { CharacterID } from "interfaces/Realtionships"

interface CharacterSwitcherProps {
    currentCharId: CharacterID | null
    options: { name: string, id: CharacterID }[]
    onChange: (value: string) => void
}

export const CharacterSwitcher: FC<CharacterSwitcherProps> = ({ currentCharId, options, onChange }) => {
    const triggerRef = useRef<HTMLButtonElement>(null)

    const showMenu = () => {
        const menu = new Menu()

        if (options.length === 0) {
            menu.addItem(item => 
                item
                    .setTitle('No relations')
                    .setDisabled(true)
            )
        }

        options.forEach((option) => {
            menu.addItem((item) =>
                item
                    .setTitle(option.name)
                    .setChecked(option.id === currentCharId)
                    .onClick(() => onChange(option.id))
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
            <span>▼</span>
        </button>
    )
}