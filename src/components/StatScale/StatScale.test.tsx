import { render, screen } from "@testing-library/react"
import { StatScale } from "./StatScale"

describe('StatScale', () => {
    it('should correctly generate bar percentage', () => {
        render(<StatScale value={15}/>)
        const barContainer = screen.getByRole('progressbar')
        const barProgress = barContainer.children[0]

        expect(barProgress).toBeInTheDocument()
        expect(barProgress).toHaveStyle('height: 75%')
    })
    it('should pass the value to aria-valuenow and have aria-valuemin and -valuemax attributes for screen readers', () => {
        render(<StatScale value={15}/>)
        const barContainer = screen.getByRole('progressbar')
        
        expect(barContainer).toHaveAttribute('aria-valuemin', '1')
        expect(barContainer).toHaveAttribute('aria-valuemax', '20')
        expect(barContainer).toHaveAttribute('aria-valuenow', '15')
    })
    it('should clamps value between min and max', () => {
        const { rerender } = render(<StatScale value={-5} />)
        const barContainer = screen.getByRole('progressbar')
        const barProgress = barContainer.children[0]

        expect(barProgress).toHaveStyle({ height: '5% '})

        rerender(<StatScale value={30} />)
        expect(barProgress).toHaveStyle({ height: '100%' })
    })
})