import { FC } from "react"
import styles from './CauseInput.module.css'

interface CauseInputProps {
    cause?: string
    handleChange: (name: string, cause: string) => void
}

export const CauseInput: FC<CauseInputProps> = ({ cause, handleChange }) => {
    return (
        <>
            <label id="change-cause-input-label" className={styles.srOnly}>Input changes cause</label>
            <input
                type="text"
                value={cause}
                onChange={(e) => handleChange('cause', e.target.value)}
                aria-labelledby="change-cause-input-label"
                placeholder="What causes the changes?"
                className={styles.input}
            />
        </>
    )
}