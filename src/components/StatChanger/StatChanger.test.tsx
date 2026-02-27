import { render, screen } from "@testing-library/react"
import { StatChanger } from "./StatChanger"
import userEvent from '@testing-library/user-event'
import { AffinityFormValue } from "interfaces/ChangeAffinityForm"

describe('StatChanger', () => {
    it('should render with label', () => {
        render(<StatChanger label="testLabel" name='name' onChange={() => { }} currentValue={undefined} />)
        const legend = screen.getByText('testLabel')
        expect(legend).toBeInTheDocument()
    })
    it('should call onChange function with name and clicked value button', async () => {
        const user = userEvent.setup()
        const name = 'testName'
        const onChangeMock = jest.fn<void, [string, AffinityFormValue]>()
        render(<StatChanger label="testLabel" name={name} onChange={onChangeMock} currentValue={undefined} />)

        const plusButton = screen.getByText('+1')
        const d4Button = screen.getByText('+1d4')

        await user.click(plusButton)
        expect(onChangeMock).toHaveBeenLastCalledWith(name, '1')

        await user.click(d4Button)
        expect(onChangeMock).toHaveBeenLastCalledWith(name, '1d4')
    })
    it('should call onChange function with name and undefined when clicked button with current value', async() => {
        const user = userEvent.setup()
        const name = 'testName'
        const onChangeMock = jest.fn<void, [string, AffinityFormValue]>()
        render(<StatChanger label="testLabel" name={name} onChange={onChangeMock} currentValue="1" />)

        const plusButton = screen.getByText('+1')
        await user.click(plusButton)
        expect(onChangeMock).toHaveBeenLastCalledWith(name, undefined)
    })
    it('should have active class on button with current value', () => {
        const { rerender } = render(<StatChanger label="testLabel" name='name' onChange={() => { }} currentValue={undefined} />)
        const plusButton = screen.getByText('+1')
        const d4Button = screen.getByText('+1d4')

        expect(plusButton).not.toHaveClass('active')
        expect(d4Button).not.toHaveClass('active')

        rerender(<StatChanger label="testLabel" name='name' onChange={() => { }} currentValue="1" />)
        expect(plusButton).toHaveClass('active')
        expect(d4Button).not.toHaveClass('active')

        rerender(<StatChanger label="testLabel" name='name' onChange={() => { }} currentValue="1d4" />)
        expect(plusButton).not.toHaveClass('active')
        expect(d4Button).toHaveClass('active')
    })
})