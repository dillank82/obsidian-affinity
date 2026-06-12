import { getCodeBlockLanguage } from "./getCodeBlockLanguage"

const createCodeBlock = (...lines: string[]) => lines.join('\n')
describe('getCodeBlockLanguage', () => {
    it('should return language if it specified correctly', () => {
        const codeBlock = createCodeBlock ('```affinitytest', '  data_yunow', '```')
        expect(getCodeBlockLanguage(codeBlock)).toBe('affinitytest')
    })
    it('should return empty string if language do not specified', () => {
        const codeBlock = createCodeBlock ('```', '  data_yunow', '```')
        expect(getCodeBlockLanguage(codeBlock)).toBe('')
    })
    it('should return empty string if string do not startss with triple backticks', () => {
        expect(getCodeBlockLanguage('affinitytest')).toBe('')
    })
    it('should handle single line input', () => {
        expect(getCodeBlockLanguage("```affinitytest")).toBe('affinitytest')
    })
    it('should return empty string fot empty string input', () => {
        expect(getCodeBlockLanguage('')).toBe('')
    })
    it.skip('should handle spaces after language', () => {
        const codeBlock = createCodeBlock ('```affinitytest   ', '  data_yunow', '```')
        expect(getCodeBlockLanguage(codeBlock)).toBe('affinitytest')
    })
})