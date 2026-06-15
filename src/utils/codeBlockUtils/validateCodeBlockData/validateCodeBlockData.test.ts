import { validateCodeBlockData } from "./validateCodeBlockData"

const mockId = 'generatedIDtest'
jest.mock("utils/generateId", () => ({ generateId: () => mockId}))

describe('validateCodeBlockData', () => {
    
    const inputStringData = 'test_string_doesnt_matter_there'
    const parseYaml = jest.fn()
    const sampleUUID = '94e73703-282e-422d-bb13-fe6ef0b46713'

    beforeEach(() => {
        jest.restoreAllMocks()
    })

    it('should correctly parse valid data', () => {
        const validData = { id: sampleUUID, toCharId: sampleUUID }
        parseYaml.mockReturnValueOnce(validData)
        expect(validateCodeBlockData(inputStringData, parseYaml)).toEqual(validData)
    })
    it('should correctly parse valid data with null toCharId', () => {
        const validData = { id: sampleUUID, toCharId: null }
        parseYaml.mockReturnValueOnce(validData)
        expect(validateCodeBlockData(inputStringData, parseYaml)).toEqual(validData)
    })
    it('should return fallback (new generated id and null as toCharId) if parser return no data', () => {
        parseYaml.mockReturnValueOnce(undefined)
        expect(validateCodeBlockData(inputStringData, parseYaml)).toEqual({ id: mockId, toCharId: null })
    })
    it('should call onError and return fallback if parses throws error', () => {
        const onError = jest.fn((err) => {})
        parseYaml.mockImplementationOnce(() => { throw new Error('Syntax Error') })

        const res = validateCodeBlockData(inputStringData, parseYaml, onError)

        expect(onError).toHaveBeenCalledTimes(1)
        expect(onError).toHaveBeenCalledWith('Syntax Error')
        expect(res).toEqual({ id: mockId, toCharId: null })
    })
    it('should call onError and return fallback if zod throws error', () => {
        const onError = jest.fn((err) => {})
        parseYaml.mockReturnValueOnce('obviously_wrong_data')

        const res = validateCodeBlockData(inputStringData, parseYaml, onError)

        expect(onError).toHaveBeenCalledTimes(1)
        expect(res).toEqual({ id: mockId, toCharId: null })
    })
})