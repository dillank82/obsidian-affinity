import { rollDice } from "utils/rollDice"
import { ChangeAffinityForm } from "./ChangeAffinityForm"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { StatChangerProps } from "components/StatChanger/StatChanger"

jest.mock('components/StatChanger/StatChanger', () => ({
    StatChanger: jest.fn(
        ({ label, name, onChange, currentValue }: StatChangerProps) => (
            <div>
                <label htmlFor={name}>{label}</label>
                <input
                    id={name}
                    data-testid={`input-${name}`}
                    value={currentValue}
                    onChange={(e) => onChange(name, e.target.value)}
            />
            </div>
        )
    )
}))
jest.mock('utils/rollDice', () => ({
    rollDice: jest.fn()
}))
const mockRollDice = rollDice as jest.Mock

describe('ChangeAffinityForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    it('should call updateAffinity with values from inputs', async () => {
        const updateAffinity = jest.fn()
        const user = userEvent.setup()
        render(<ChangeAffinityForm updateAffinity={updateAffinity} />)

        const affectionInput = screen.getByLabelText('Affection')
        const respectInput = screen.getByLabelText('Respect')
        const trustInput = screen.getByLabelText('Trust')

        fireEvent.change(affectionInput, { target: { value: '8' } })
        fireEvent.change(respectInput, { target: { value: '1' } })
        fireEvent.change(trustInput, { target: { value: '2' } })

        const submitButton = screen.getByRole('button')
        await user.click(submitButton)

        expect(updateAffinity).toHaveBeenCalledTimes(1)
        expect(updateAffinity).toHaveBeenCalledWith({
            affection: 8,
            respect: 1,
            trust: 2
        })
    })
    it('should use value from rollDice if input value is "1d4"', async () => {
        const updateAffinity = jest.fn()
        const user = userEvent.setup()
        render(<ChangeAffinityForm updateAffinity={updateAffinity} />)

        const affectionInput = screen.getByLabelText('Affection')
        fireEvent.change(affectionInput, { target: { value: '1d4' } })
        mockRollDice.mockImplementationOnce(() => 128)

        const submitButton = screen.getByRole('button')
        await user.click(submitButton)

        expect(updateAffinity).toHaveBeenCalledTimes(1)
        expect(updateAffinity).toHaveBeenCalledWith(expect.objectContaining({
            affection: 128
        }))
    })
    it('should replace other NaN values with 0', async () => {
        const updateAffinity = jest.fn()
        const user = userEvent.setup()
        render(<ChangeAffinityForm updateAffinity={updateAffinity} />)

        const affectionInput = screen.getByLabelText('Affection')
        const respectInput = screen.getByLabelText('Respect')
        const trustInput = screen.getByLabelText('Trust')

        fireEvent.change(affectionInput, { target: { value: '' } })
        fireEvent.change(respectInput, { target: { value: 'zero' } })
        fireEvent.change(trustInput, { target: { value: true } })

        const submitButton = screen.getByRole('button')
        await user.click(submitButton)

        expect(updateAffinity).toHaveBeenCalledTimes(1)
        expect(updateAffinity).toHaveBeenCalledWith({
            affection: 0,
            respect: 0,
            trust: 0
        })
    })
    it('should clear values after submit', async () => {
        const updateAffinity = jest.fn()
        const user = userEvent.setup()
        render(<ChangeAffinityForm updateAffinity={updateAffinity} />)

        const respectInput: HTMLInputElement = screen.getByLabelText('Respect')
        fireEvent.change(respectInput, { target: { value: '1' } })

        const submitButton = screen.getByRole('button')
        await user.click(submitButton)
        await user.click(submitButton)

        expect(updateAffinity).toHaveBeenCalledTimes(2)
        expect(updateAffinity).toHaveBeenLastCalledWith({
            affection: 0,
            respect: 0,
            trust: 0
        })
    })
})