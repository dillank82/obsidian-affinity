import { FC } from "react"
import styles from './CauseInput.module.css'

interface CauseInputProps {
    cause?: string
    handleChange: (name: string, cause: string) => void
}

export const CauseInput: FC<CauseInputProps> = ({ cause, handleChange }) => {
    return (
        <>
            <label htmlFor="change-cause-input" className={styles.srOnly}>Input changes cause</label>
            <input
                id="change-cause-input"
                type="text"
                value={cause}
                onChange={(e) => handleChange('cause', e.target.value)}
                placeholder="What causes the changes?"
                className={styles.input}
            />
        </>
    )
}