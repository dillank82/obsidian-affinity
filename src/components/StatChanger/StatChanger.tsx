import { FC, useState } from "react"

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
                    className={selectedValue === "1" ? "active" : ""}
                    onClick={() => handleToggle("1")}
                >
                    +1
                </button>
                
                <button 
                    type="button" 
                    className={selectedValue === "1d4" ? "active" : ""}
                    onClick={() => handleToggle("1d4")}
                >
                    1d4
                </button>
            </div>
        </fieldset>
    )
}