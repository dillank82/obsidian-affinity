import { StatChanger } from "components/StatChanger/StatChanger"
import { Stats } from "interfaces/Stats"
import { FC, FormEvent, useState } from "react"
import { rollDice } from "utils/rollDice"
import styles from './ChangeAffinityForm.module.css'
import { AffinityFormState, AffinityFormValue } from "interfaces/ChangeAffinityForm"

interface ChangeAffinityFormProps {
    updateAffinity: (delta: Partial<Stats>) => void
}

export const ChangeAffinityForm: FC<ChangeAffinityFormProps> = ({ updateAffinity }) => {
    const [formValues, setFormValues] = useState<AffinityFormState>({})
    const handleChange = (name: string, value: AffinityFormValue) => {
        setFormValues(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const resolveValue = (value: AffinityFormValue): number => {
            if (value === '1d4') return rollDice(4)
            return Number(value) || 0
        }
        const delta: Partial<Stats> = {
            affection: resolveValue(formValues.affection),
            respect: resolveValue(formValues.respect),
            trust: resolveValue(formValues.trust)
        }

        updateAffinity(delta)
        setFormValues({})
    }
    return (
        <form
            id="change-affinity-form"
            onSubmit={handleSubmit}
            className={styles.formContainer}
            aria-label="Choose affinity changes"  
        >
            <div className={styles.statChangersContainer}>
                <StatChanger label="Affection" name="affection" currentValue={formValues.affection} onChange={handleChange}/>
                <StatChanger label="Respect" name="respect" currentValue={formValues.respect} onChange={handleChange}/>
                <StatChanger label="Trust" name="trust" currentValue={formValues.trust} onChange={handleChange}/>
            </div>
            <button type="submit" className={styles.button}>Submit</button>
        </form>
    )
}