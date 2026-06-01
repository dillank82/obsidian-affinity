import { FC, Ref } from "react"
import styles from './CauseInput.module.css'

interface CauseInputProps {
    ref: Ref<HTMLInputElement>
}

export const CauseInput: FC<CauseInputProps> = ({ ref }) => {
    return (
        <>
            <label id="change-cause-input-label" className={styles.srOnly}>Input changes cause</label>
            <input
                type="text"
                ref={ref}
                aria-labelledby="change-cause-input-label"
                placeholder="What causes the changes?"
                className={styles.input}
            />
        </>
    )
}