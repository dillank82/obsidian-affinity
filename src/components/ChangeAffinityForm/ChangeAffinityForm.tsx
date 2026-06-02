import { StatChanger } from "components/StatChanger/StatChanger"
import { Stats } from "interfaces/Stats"
import { FC, SubmitEvent, useState } from "react"
import { rollDice } from "utils/rollDice"
import styles from './ChangeAffinityForm.module.css'
import { AffinityFormState, AffinityFormValue } from "interfaces/ChangeAffinityForm"
import { CauseInput } from "components/CauseInput/CauseInput"
import { UpdateAffinity } from "interfaces/useAffinity"

const INITIAL_FORM_STATE: AffinityFormState = {
    affection: "",
    respect: "",
    trust: "",
    cause: ""
}

interface ChangeAffinityFormProps {
    updateAffinity: UpdateAffinity
    onError: (msg: string) => void
}

export const ChangeAffinityForm: FC<ChangeAffinityFormProps> = ({ updateAffinity, onError }) => {
    const [formValues, setFormValues] = useState<AffinityFormState>(INITIAL_FORM_STATE)
    const handleValueChange = (name: string, value: AffinityFormValue) => {
        setFormValues(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const isCauseMissing = !formValues.cause.trim()
        const isNoChanges = !formValues.affection && !formValues.respect && !formValues.trust

        if (isCauseMissing || isNoChanges) {
            onError('Select at least one change and specify its cause')
            return
        }

        const resolveValue = (value: AffinityFormValue): number => {
            if (value === '1d4') return rollDice(4)
            if (value === '-1d4') return -rollDice(4)
            return Number(value) || 0
        }
        const delta: Partial<Stats> = {
            affection: resolveValue(formValues.affection),
            respect: resolveValue(formValues.respect),
            trust: resolveValue(formValues.trust)
        }

        updateAffinity(delta, formValues.cause)
        setFormValues(INITIAL_FORM_STATE)
    }
    return (
        <form
            id="change-affinity-form"
            onSubmit={handleSubmit}
            className={styles.formContainer}
            aria-label="Choose affinity changes"
        >
            <fieldset className={styles.statChangersContainer}>
                <legend className={styles.srOnly}>Use button groups to choose stats changes</legend>
                <StatChanger label="Affection" name="affection" currentValue={formValues.affection} onChange={handleValueChange} />
                <StatChanger label="Respect" name="respect" currentValue={formValues.respect} onChange={handleValueChange} />
                <StatChanger label="Trust" name="trust" currentValue={formValues.trust} onChange={handleValueChange} />
            </fieldset>
            <CauseInput cause={formValues.cause} handleChange={handleValueChange} />
            <button type="submit" className={styles.button}>Submit</button>
        </form>
    )
}