import { render, screen } from "@testing-library/react"
import { StatChanger } from "./StatChanger"
import userEvent from '@testing-library/user-event'

describe('StatChanger', () => {
    it('should render with label and name and change input value correctly when buttons selected or have 0 value if not', async() => {
        const user = userEvent.setup()
        render(<StatChanger label="testLabel" name="testName" />)

        const legend = screen.getByText('testLabel')
        expect(legend).toBeInTheDocument()

        const input: HTMLInputElement = screen.getByTestId('hidden-input-testName')
        expect(input.value).toBe("0")
        
        const plusButton = screen.getByText('+1')
        const d4Button = screen.getByText('+1d4')

        await user.click(plusButton)
        expect(input.value).toBe("1")
        expect(plusButton).toHaveClass('active')

        await user.click(d4Button)
        expect (input.value).toBe("1d4")
        expect(d4Button).toHaveClass('active')
        expect(plusButton).not.toHaveClass('active')

        await user.click(d4Button)
        expect (input.value).toBe("0")
        expect(d4Button).not.toHaveClass('active')
        expect(plusButton).not.toHaveClass('active')
    })
})