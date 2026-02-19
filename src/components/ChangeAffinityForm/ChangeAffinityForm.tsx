import { StatChanger } from "components/StatChanger/StatChanger"
import { Stats } from "interfaces/Stats"
import { FC, FormEvent } from "react"
import { rollDice } from "utils/rollDice"
import styles from './ChangeAffinityForm.module.css'

interface ChangeAffinityFormProps {
    updateAffinity: (delta: Partial<Stats>) => void
}

export const ChangeAffinityForm: FC<ChangeAffinityFormProps> = ({ updateAffinity }) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const resolveValue = (value: FormDataEntryValue | null): number => {
            if (value === '1d4') return rollDice(4)
            return Number(value) || 0
        }
        const delta: Partial<Stats> = {
            affection: resolveValue(formData.get('affection')),
            respect: resolveValue(formData.get('respect')),
            trust: resolveValue(formData.get('trust'))
        }

        updateAffinity(delta)
    }
    return (
        <form
            id="change-affinity-form"
            onSubmit={handleSubmit}
            className={styles.formContainer}  
        >
            <label htmlFor="change-affinity-form">Choose affinity changes</label>
            <StatChanger label="Affection" name="affection" />
            <StatChanger label="Respect" name="respect" />
            <StatChanger label="Trust" name="trust" />
            <button type="submit" className={styles.button}>Submit</button>
        </form>
    )
}