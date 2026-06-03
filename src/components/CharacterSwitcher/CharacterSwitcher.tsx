import { FC, useRef, useState } from "react"
import { Menu } from "obsidian"
import styles from './CharacterSwitcher.module.css'
import { Character, CharacterID } from "interfaces/Realtionships"

interface CharacterSwitcherProps {
    currentCharId: CharacterID | null
    options: Character[]
    onChange: (value: string) => void
}

export const CharacterSwitcher: FC<CharacterSwitcherProps> = ({ currentCharId, options, onChange }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const triggerRef = useRef<HTMLButtonElement>(null)

    const showMenu = () => {
        setIsOpen(true)
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
        
        menu.onHide(() => { setIsOpen(false) })
    }

    return (
        <button 
            ref={triggerRef} 
            onClick={showMenu}
            className={styles.trigger}
            aria-label="Select character"
            aria-haspopup='true'
            aria-expanded={isOpen}
        >
            <span aria-hidden="true">▼</span>
        </button>
    )
}