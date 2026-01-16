import { PluginSettings } from "settings"
import { RelationshipsManager } from "./RelationshipsManager"

describe('RelationshipsManager', () => {
    const mockedSave = () => new Promise<void>((resolve) => { resolve() })
    const createRelManager = (settings: PluginSettings) => new RelationshipsManager(settings, mockedSave)
    const createSampleRel = (overrides = {}) => ({
        fromChar: 'Char_A',
        toChar: 'Char_B',
        stats: {
            affection: 18,
            respect: 4,
            trust: 8
        },
        ...overrides
    })

    test('should create valid relation', async () => {
        const fromCharId = 'fromchar'
        const toCharId = 'tochar'
        const settings = {
            relationships: []
        } as unknown as PluginSettings
        const relManager = createRelManager(settings)

        await relManager.createRelation(fromCharId, toCharId)
        expect(settings.relationships.length).toBe(1)

        const rel = settings.relationships[0]!

        expect(rel.fromChar).toBe(fromCharId)
        expect(rel.toChar).toBe(toCharId)
        expect(rel.stats).toEqual({
            affection: relManager.initialStatsValue,
            respect: relManager.initialStatsValue,
            trust: relManager.initialStatsValue,
        })
    })

    test('should return a relation item in getRelation', () => {
        const sapmpleRel = createSampleRel()
        const settings = {
            relationships: [sapmpleRel]
        } as unknown as PluginSettings

        const relManager = createRelManager(settings)
        const rel = relManager.getRelation(sapmpleRel.fromChar, sapmpleRel.toChar)
        expect(rel).toEqual(sapmpleRel)
    })

    test('should correctly udate relation in updateAffinity', async() => {
        const rel = createSampleRel()
        const startStats = rel.stats
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = createRelManager(settings)

        const deltaStats = {
            affection: -1,
            respect: 1,
            trust: 4
        }
        await relManager.updateAffinity(rel.fromChar, rel.toChar, deltaStats)

        expect(rel.stats).toEqual({
            affection: startStats.affection + deltaStats.affection,
            respect: startStats.respect + deltaStats.respect,
            trust: startStats.trust + deltaStats.trust,
        })
    })

    test('should throw error when try to create realtion with existing direction', async () => {
        const rel = createSampleRel()
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = createRelManager(settings)
        expect(await relManager.createRelation(rel.fromChar, rel.toChar)).toThrow('This relation already exists')
    })
    
    test('should throw error when from and char ID are same', () => {
        const from = 'A'
        const to = from
        const settings = {} as unknown as PluginSettings

        const relManager = createRelManager(settings)
        const error = '2 different characters must be specified'

        expect(relManager.createRelation(from, to)).toThrow(error)
        expect(relManager.getRelation(from, to)).toThrow(error)
        expect(relManager.updateAffinity(from, to, {})).toThrow(error)
    })

    test('stats must not beat min and max edges after updating', async() => {
        const rel = createSampleRel({
            stats: {
                affection: 20,
                respect: 1
            }
        })
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = createRelManager(settings)
        const res = await relManager.updateAffinity(rel.fromChar, rel.toChar, { affection: 4, respect: -4 })
        expect(res.affection).toEqual({
            value: 20,
            change: 0,
            status: 'MAXED_OUT'
        })
        expect(res.respect).toEqual({
            value: 1,
            change: 0,
            status: 'MINED_OUT'
        })
    })

    test('should return null when trying get non-existing relation', () => {
        const settings = {} as unknown as PluginSettings
        const relManager = createRelManager(settings)
        const rel = relManager.getRelation('fromCharId', 'toCharId')
        expect(rel).toBeNull()
    })

    test('updateAffinity should work correctly with delta === 0', async() => {
        const rel = createSampleRel()
        const startStats = rel.stats
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = createRelManager(settings)

        const res = await relManager.updateAffinity(
            rel.fromChar, rel.toChar, {
            affection: 0,
            respect: 0,
            trust: 0
        })
        expect(res.affection).toEqual({
            value: startStats.affection,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(res.respect).toEqual({
            value: startStats.respect,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(res.trust).toEqual({
            value: startStats.trust,
            change: 0,
            status: 'UNCHANGED'
        })
    })

    test('updateAffinity should work correctly with partial set of stats', async() => {
        const rel = createSampleRel()
        const startStats = rel.stats
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = createRelManager(settings)
        const delta = {
            respect: 1,
            trust: -2
        }
        const res = await relManager.updateAffinity(rel.fromChar, rel.toChar, delta)

        expect(res.affection).toEqual({
            value: startStats.affection,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(res.respect).toEqual({
            value: startStats.respect + delta.respect,
            change: delta.respect,
            status: 'CHANGED'
        })
        expect(res.trust).toEqual({
            value: startStats.trust + delta.trust,
            change: delta.trust,
            status: 'CHANGED'
        })
    })

    test('updateAffinity should work correctly with empty set of stats', async() => {
        const rel = createSampleRel()
        const startStats = rel.stats
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = createRelManager(settings)

        const res = await relManager.updateAffinity(rel.fromChar, rel.toChar, {})
        expect(res.affection).toEqual({
            value: startStats.affection,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(res.respect).toEqual({
            value: startStats.respect,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(res.trust).toEqual({
            value: startStats.trust,
            change: 0,
            status: 'UNCHANGED'
        })
    })
    
    test('should throw error when trying to update non-existing relation', () => {
        const settings = {} as unknown as PluginSettings
        const relManager = createRelManager(settings)
        expect(relManager.updateAffinity('fromCharId', 'toCharId', {})).toThrow('Relation not found')
    })
})