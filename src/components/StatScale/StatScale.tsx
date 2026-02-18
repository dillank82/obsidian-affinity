import { FC } from "react"
import styles from "./StatScale.module.css"
interface StatScaleProps {
    value: number
}

export const StatScale: FC<StatScaleProps> = ({ value }) => {
    const percentage = (value / 20) * 100
    return (
        <div
            className={styles.container}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={20}
            aria-orientation="vertical"
        >
            <div 
                className={styles.bar}
                style={{height: `${percentage}%`}}
            />
        </div>
    )
}