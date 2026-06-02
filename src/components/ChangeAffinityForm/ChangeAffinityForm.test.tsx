import { rollDice } from "utils/rollDice"
import { ChangeAffinityForm } from "./ChangeAffinityForm"
import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { StatChangerProps } from "components/StatChanger/StatChanger"

jest.useFakeTimers()

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
const onError = jest.fn((msg) => { })

describe('ChangeAffinityForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    it('should call updateAffinity with values from inputs', async () => {
        const updateAffinity = jest.fn()
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<ChangeAffinityForm updateAffinity={updateAffinity} onError={onError} />)

        const affectionInput = screen.getByLabelText('Affection')
        const respectInput = screen.getByLabelText('Respect')
        const trustInput = screen.getByLabelText('Trust')
        const causeInput = screen.getByLabelText('Input changes cause')

        fireEvent.change(affectionInput, { target: { value: '8' } })
        fireEvent.change(respectInput, { target: { value: '1' } })
        fireEvent.change(trustInput, { target: { value: '2' } })
        await user.type(causeInput, 'Tried to friend')

        act(() => {
            jest.advanceTimersByTime(500)
        })
        const submitButton = screen.getByRole('button')
        await user.click(submitButton)

        expect(updateAffinity).toHaveBeenCalledTimes(1)
        expect(updateAffinity).toHaveBeenCalledWith({
            affection: 8,
            respect: 1,
            trust: 2
        }, 'Tried to friend')
    })
    it('should use value from rollDice if input value is "1d4"', async () => {
        const updateAffinity = jest.fn()
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<ChangeAffinityForm updateAffinity={updateAffinity} onError={onError} />)

        const affectionInput = screen.getByLabelText('Affection')
        const causeInput = screen.getByLabelText('Input changes cause')

        fireEvent.change(affectionInput, { target: { value: '1d4' } })
        await user.type(causeInput, 'Wrote tests')
        mockRollDice.mockImplementationOnce(() => 128)

        act(() => {
            jest.advanceTimersByTime(500)
        })
        const submitButton = screen.getByRole('button')
        await user.click(submitButton)

        expect(updateAffinity).toHaveBeenCalledTimes(1)
        expect(updateAffinity).toHaveBeenCalledWith(expect.objectContaining({
            affection: 128
        }), 'Wrote tests')
    })
    it('should replace other NaN values with 0', async () => {
        const updateAffinity = jest.fn()
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<ChangeAffinityForm updateAffinity={updateAffinity} onError={onError} />)

        const affectionInput = screen.getByLabelText('Affection')
        const respectInput = screen.getByLabelText('Respect')
        const trustInput = screen.getByLabelText('Trust')
        const causeInput = screen.getByLabelText('Input changes cause')
        
        fireEvent.change(affectionInput, { target: { value: '' } })
        fireEvent.change(respectInput, { target: { value: 'zero' } })
        fireEvent.change(trustInput, { target: { value: true } })
        await user.type(causeInput, 'Is0')

        act(() => {
            jest.advanceTimersByTime(500)
        })
        const submitButton = screen.getByRole('button')
        await user.click(submitButton)

        expect(updateAffinity).toHaveBeenCalledTimes(1)
        expect(updateAffinity).toHaveBeenCalledWith({
            affection: 0,
            respect: 0,
            trust: 0
        }, 'Is0')
    })
    it('should call onError and not call updateAffinity if no cause', async () => {
        const updateAffinity = jest.fn()
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<ChangeAffinityForm updateAffinity={updateAffinity} onError={onError} />)

        const affectionInput: HTMLInputElement = screen.getByLabelText('Affection')
        fireEvent.change(affectionInput, { target: { value: '1' } })

        act(() => {
            jest.advanceTimersByTime(500)
        })
        const submitButton = screen.getByRole('button')
        await user.click(submitButton)
        expect(updateAffinity).toHaveBeenCalledTimes(0)
        expect(onError).toHaveBeenCalledTimes(1)
    })
    it('should call onError and not call updateAffinity if no changes', async () => {
        const updateAffinity = jest.fn()
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<ChangeAffinityForm updateAffinity={updateAffinity} onError={onError} />)

        const causeInput = screen.getByLabelText('Input changes cause')
        await user.type(causeInput, 'Cause')

        act(() => {
            jest.advanceTimersByTime(500)
        })
        const submitButton = screen.getByRole('button')
        await user.click(submitButton)
        expect(updateAffinity).toHaveBeenCalledTimes(0)
        expect(onError).toHaveBeenCalledTimes(1)
    })
    it('should clear values after submit', async () => {
        const updateAffinity = jest.fn()
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<ChangeAffinityForm updateAffinity={updateAffinity} onError={onError} />)

        const respectInput: HTMLInputElement = screen.getByLabelText('Respect')
        const causeInput = screen.getByLabelText('Input changes cause')
        fireEvent.change(respectInput, { target: { value: '1' } })
        await user.type(causeInput, 'Cause')

        act(() => {
            jest.advanceTimersByTime(500)
        })
        const submitButton = screen.getByRole('button')
        await user.click(submitButton)
        expect(updateAffinity).toHaveBeenCalledTimes(1)
        expect(onError).toHaveBeenCalledTimes(0)
        await user.click(submitButton)
        expect(updateAffinity).toHaveBeenCalledTimes(1)
        expect(onError).toHaveBeenCalledTimes(1)
    })
})