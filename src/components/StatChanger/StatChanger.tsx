import { FC } from "react"
import styles from './StatChanger.module.css'
import { AffinityFormValue } from "interfaces/ChangeAffinityForm"

export interface StatChangerProps {
    label: string
    name: string
    onChange: (name: string, value: AffinityFormValue) => void
    currentValue: AffinityFormValue 
}

export const StatChanger: FC<StatChangerProps> = ({ label, name, onChange, currentValue }) => {
    const handleToggle = (value: string) => {
        onChange(name, currentValue === value ? undefined : value)
    }
    return (
        <fieldset>
            <legend>{label}</legend>
            <div>
                <button 
                    type="button" 
                    className={`${styles.button} ${currentValue === "1" ? styles.active : ""}`}
                    onClick={() => handleToggle("1")}
                >
                    +1
                </button>
                
                <button 
                    type="button" 
                    className={`${styles.button} ${currentValue === "1d4" ? styles.active : ""}`}
                    onClick={() => handleToggle("1d4")}
                >
                    +1d4
                </button>
            </div>
        </fieldset>
    )
}