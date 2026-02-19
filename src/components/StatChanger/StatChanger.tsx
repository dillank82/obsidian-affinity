import { FC, useState } from "react"
import styles from './StatChanger.module.css'

interface StatChangerProps {
    label: string
    name: string
}

export const StatChanger: FC<StatChangerProps> = ({ label, name }) => {
    const [selectedValue, setSelectedValue] = useState<string | null>(null)
    const handleToggle = (value: string) => {
        setSelectedValue(prev => prev === value ? null : value)
    }
    return (
        <fieldset>
            <legend>{label}</legend>
            <div>
                <input type="hidden" name={name} value={selectedValue || '0'}/>

                <button 
                    type="button" 
                    className={`${styles.button} ${selectedValue === "1" ? styles.active : ""}`}
                    onClick={() => handleToggle("1")}
                >
                    +1
                </button>
                
                <button 
                    type="button" 
                    className={`${styles.button} ${selectedValue === "1d4" ? styles.active : ""}`}
                    onClick={() => handleToggle("1d4")}
                >
                    1d4
                </button>
            </div>
        </fieldset>
    )
}