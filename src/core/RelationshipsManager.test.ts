import { Store } from "store"
import { RelationshipsManager } from "./RelationshipsManager"
import { CharacterID } from "interfaces/Realtionships"
import { Stats } from "interfaces/Stats"

describe('RelationshipsManager', () => {
    const createRelManager = (data: Store) => new RelationshipsManager(data)
    const createSampleRel = (fromChar: CharacterID = 'testChar1', toChar: CharacterID = 'testChar2', overrides = {}): Store => ({
        relationships: {
            [fromChar]: {
                [toChar]: {
                    affection: 10,
                    respect: 10,
                    trust: 10,
                    ...overrides
                }
            }
        },
        setRelation: jest.fn((from: CharacterID, to: CharacterID, newRel: Stats) => { })
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('should create valid relation and return result object', () => {
        const data = createSampleRel()
        const relManager = createRelManager(data)

        const from = 'fromchar'
        const to = 'tochar'
        const rel = relManager.createRelation(from, to)

        expect(rel).toEqual({
            affection: relManager.initialStatsValue,
            respect: relManager.initialStatsValue,
            trust: relManager.initialStatsValue,
        })
        expect(data.setRelation).toHaveBeenCalledTimes(1)
        expect(data.setRelation).toHaveBeenCalledWith(from, to, rel)
    })

    test('should correctly update relation in updateAffinity', () => {
        const from = 'test'
        const to = 'test2'
        const data = createSampleRel(from, to)
        const startStats = data.relationships[from]![to]!
        const relManager = createRelManager(data)

        const deltaStats = {
            affection: -1,
            respect: 1,
            trust: 4
        }
        const updateData = relManager.updateAffinity(from, to, deltaStats)

        expect(updateData.newRel).toEqual({
            affection: startStats.affection + deltaStats.affection,
            respect: startStats.respect + deltaStats.respect,
            trust: startStats.trust + deltaStats.trust,
        })
        expect(updateData.result).toMatchObject({
            affection: {
                value: updateData.newRel.affection,
                change: deltaStats.affection,
                status: 'CHANGED'
            },
            respect: {
                value: updateData.newRel.respect,
                change: deltaStats.respect,
                status: 'CHANGED'
            },
            trust: {
                value: updateData.newRel.trust,
                change: deltaStats.trust,
                status: 'CHANGED'
            },
        })
        expect(data.setRelation).toHaveBeenCalledTimes(1)
        expect(data.setRelation).toHaveBeenCalledWith(from, to, deltaStats)
    })

    test('should throw error when try to create realtion with existing direction', () => {
        const from = '111'
        const to = '222'
        const data = createSampleRel(from, to)
        const relManager = createRelManager(data)
        expect(() => { relManager.createRelation(from, to) }).toThrow('This relation already exists')
    })

    test('updateAffinity should work correctly with partial set of stats', () => {
        const from = 'Morffrom'
        const to = 'Otto'
        const data = createSampleRel(from, to)
        const startStats = data.relationships[from]![to]!
        const relManager = createRelManager(data)

        const delta = {
            respect: 1,
            trust: -2
        }
        const resData = relManager.updateAffinity(from, to, delta)

        expect(resData.result.affection).toEqual({
            value: startStats.affection,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(resData.result.respect).toEqual({
            value: startStats.respect + delta.respect,
            change: delta.respect,
            status: 'CHANGED'
        })
        expect(resData.result.trust).toEqual({
            value: startStats.trust + delta.trust,
            change: delta.trust,
            status: 'CHANGED'
        })
    })

    test('stats must not beat min and max edges after updating', () => {
        const from = 'Alex'
        const to = 'Steve'
        const data = createSampleRel(from, to, { affection: 19, respect: 2 })
        const relManager = createRelManager(data)

        const resData = relManager.updateAffinity(from, to, { affection: 20, respect: -20 })
        expect(resData.result.affection).toEqual({
            value: 20,
            change: 1,
            status: 'MAXED_OUT'
        })
        expect(resData.result.respect).toEqual({
            value: 1,
            change: -1,
            status: 'MINED_OUT'
        })
    })

    test('updateAffinity should work correctly with delta === 0', () => {
        const from = 'K9'
        const to = 'miceAngel'
        const data = createSampleRel(from, to)
        const startStats = data.relationships[from]![to]!
        const relManager = createRelManager(data)

        const resData = relManager.updateAffinity(
            from, to, {
            affection: 0,
            respect: 0,
            trust: 0
        })
        expect(resData.result.affection).toEqual({
            value: startStats.affection,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(resData.result.respect).toEqual({
            value: startStats.respect,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(resData.result.trust).toEqual({
            value: startStats.trust,
            change: 0,
            status: 'UNCHANGED'
        })
    })

    test('updateAffinity should work correctly with empty set of stats', () => {
        const from = 'Shiney'
        const to = 'Stephan'
        const data = createSampleRel(from, to)
        const startStats = data.relationships[from]![to]!
        const relManager = createRelManager(data)

        const resData = relManager.updateAffinity(from, to, {})
        expect(resData.result.affection).toEqual({
            value: startStats.affection,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(resData.result.respect).toEqual({
            value: startStats.respect,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(resData.result.trust).toEqual({
            value: startStats.trust,
            change: 0,
            status: 'UNCHANGED'
        })
    })

    test('should throw error when trying to update non-existing relation', () => {
        const data = {
            relationships: {},
            setRelation: () => { }
        }
        const relManager = createRelManager(data)
        expect(() => { relManager.updateAffinity('fromCharId', 'toCharId', {}) }).toThrow('Relation not found')
    })
})