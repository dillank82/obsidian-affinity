import { extractCodeBlockData } from "./extractCodeBlockData"

describe('extractCodeBlockData', () => {
    it('should return code block without first and last lines', () => {
        const codeBlock = ['```', '  testData', '  another line', '```'].join('\n')
        const expected = ['  testData', '  another line'].join('\n')
        expect(extractCodeBlockData(codeBlock)).toBe(expected)
    })
    it('should return empty string for not code block input', () => {
        expect(extractCodeBlockData('just_string')).toBe('')
    })
    it('should return empty string for empty string input', () => {
        expect(extractCodeBlockData('')).toBe('')
    })
    it.skip('should correctly handle Windows line breaks (CRLF)', () => {
        const codeBlock = ['```', '  testData', '  another line', '```'].join('\r\n')
        const expected = ['  testData', '  another line'].join('\n')
        expect(extractCodeBlockData(codeBlock)).toBe(expected)
    })
})