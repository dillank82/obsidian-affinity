import { RelationshipsManager } from "./RelationshipsManager"
import { AffinityData } from "interfaces/AffinityData"

describe('RelationshipsManager', () => {
    const createRelManager = (data: AffinityData) => new RelationshipsManager(data)
    const createSampleRel = (charName: string = 'testChar', overrides = {}): AffinityData => ({
        [charName]: {
            affection: 10,
            respect: 10,
            trust: 10,
            ...overrides
        }
    })

    test('should create valid relation and return extended object', () => {
        const data = createSampleRel()
        const relManager = createRelManager(data)

        const toCharId = 'tochar'
        const rel = relManager.createRelation(toCharId)

        expect(rel).toEqual({
            ...data,
            [toCharId]: {
                affection: relManager.initialStatsValue,
                respect: relManager.initialStatsValue,
                trust: relManager.initialStatsValue,
            }
        })
    })

    test('should correctly update relation in updateAffinity', () => {
        const charName = 'test'
        const data = createSampleRel(charName)
        const startStats = data[charName]!
        const relManager = createRelManager(data)

        const deltaStats = {
            affection: -1,
            respect: 1,
            trust: 4
        }
        const updateData = relManager.updateAffinity(charName, deltaStats)

        expect(updateData.newData).toEqual({
            [charName]: {
                affection: startStats.affection + deltaStats.affection,
                respect: startStats.respect + deltaStats.respect,
                trust: startStats.trust + deltaStats.trust,
            }
        })
        expect(updateData.result).toMatchObject({
            affection: {
                value: updateData.newData[charName]?.affection,
                change: deltaStats.affection,
                status: 'CHANGED'
            },
            respect: {
                value: updateData.newData[charName]?.respect,
                change: deltaStats.respect,
                status: 'CHANGED'
            },
            trust: {
                value: updateData.newData[charName]?.trust,
                change: deltaStats.trust,
                status: 'CHANGED'
            },
        })
    })

    test('should throw error when try to create realtion with existing direction', () => {
        const charName = '222'
        const data = createSampleRel(charName)
        const relManager = createRelManager(data)
        expect(() => { relManager.createRelation(charName) }).toThrow('This relation already exists')
    })

    test('updateAffinity should work correctly with partial set of stats', () => {
        const charName = 'Otto'
        const data = createSampleRel(charName)
        const startStats = data[charName]!
        const relManager = createRelManager(data)

        const delta = {
            respect: 1,
            trust: -2
        }
        const resData = relManager.updateAffinity(charName, delta)

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
        const charName = 'Alex'
        const data = createSampleRel(charName, { affection: 19, respect: 2 })
        const relManager = createRelManager(data)

        const resData = relManager.updateAffinity(charName, { affection: 20, respect: -20 })
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
        const charName = 'K9'
        const data = createSampleRel(charName)
        const startStats = data[charName]!
        const relManager = createRelManager(data)

        const resData = relManager.updateAffinity(
            charName, {
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
        const charName = 'Shiney'
        const data = createSampleRel(charName)
        const startStats = data[charName]!
        const relManager = createRelManager(data)

        const resData = relManager.updateAffinity(charName, {})
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
        const data = {}
        const relManager = createRelManager(data)
        expect(() => { relManager.updateAffinity('toCharId', {}) }).toThrow('Relation not found')
    })
})