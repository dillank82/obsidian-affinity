import { PluginSettings } from "settings"
import { RelationshipsManager } from "./RelationshipsManager"

describe('RelationshipsManager', () => {
    const mockedSave = () => new Promise<void>((resolve) => { resolve() })

    test('should create valid relation', async () => {
        const settings = {
            relationships: []
        } as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)

        const fromChar = 'Char_A'
        const toChar = 'Char_B'
        await relManager.createRelation(fromChar, toChar)

        expect(settings.relationships.length).toBe(1)

        const rel = settings.relationships[0]!

        expect(rel.fromChar).toBe(fromChar)
        expect(rel.toChar).toBe(toChar)
        expect(rel.stats).toEqual({
            affection: relManager.initialStatsValue,
            respect: relManager.initialStatsValue,
            trust: relManager.initialStatsValue,
        })
    })
    test('should return a relation item in getRelation', () => {
        const fromChar = 'Char_A'
        const toChar = 'Char_B'
        const sapmpleRel = {
            fromChar: fromChar,
            toChar: toChar,
            stats: {
                affection: 17,
                respect: 10,
                trust: 8
            }
        }
        const settings = {
            relationships: [sapmpleRel]
        } as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)
        const rel = relManager.getRelation(fromChar, toChar)
        expect(rel).toEqual(sapmpleRel)
    })
    test('should correctly udate relation in updateAffinity', () => {
        const fromChar = 'Char_A'
        const toChar = 'Char_B'
        const startStats = {
            affection: 17,
            respect: 10,
            trust: 8
        }
        const rel = {
            fromChar: fromChar,
            toChar: toChar,
            stats: {
                affection: startStats.affection,
                respect: startStats.respect,
                trust: startStats.trust
            }
        }
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)

        const deltaStats = {
            affection: 1,
            respect: -1,
            trust: 1
        }
        relManager.updateAffinity(
            fromChar,
            toChar,
            deltaStats
        )

        expect(rel.stats.affection).toBe(startStats.affection + deltaStats.affection)
        expect(rel.stats.respect).toBe(startStats.respect + deltaStats.respect)
        expect(rel.stats.trust).toBe(startStats.trust + deltaStats.trust)
    })
    test('should throw error when try to create realtion with existing direction', async() => {
        const fromChar = 'Char_A'
        const toChar = 'Char_B'
        const rel = {
            fromChar: fromChar,
            toChar: toChar,
            stats: {}
        }
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)
        expect(await relManager.createRelation(fromChar, toChar)).toThrow('This relation already exists')
    })
    test('should throw error when fromChar === toChar', () => {
        const fromChar = 'Char_A'
        const toChar = fromChar

        const settings = {} as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)
        const error = '2 different characters must be specified'

        expect(relManager.createRelation(fromChar, toChar)).toThrow(error)
        expect(relManager.getRelation(fromChar, toChar)).toThrow(error)
        expect(relManager.updateAffinity(fromChar, toChar, {})).toThrow(error)
    })
    test('stats must not beat min and max edges after updating', () => {
        const fromChar = 'Char_A'
        const toChar = 'Char_B'
        const startStats = {
            affection: 20,
            respect: 1,
            trust: 8
        }
        const rel = {
            fromChar: fromChar,
            toChar: toChar,
            stats: {
                affection: startStats.affection,
                respect: startStats.respect,
                trust: startStats.trust
            }
        }
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)
        const res = relManager.updateAffinity(fromChar, toChar, { affection: 4, respect: -4 })
        expect(res.affection).toEqual({
            value: startStats.affection,
            change: 0,
            status: 'MAXED_OUT'
        })
        expect(res.respect).toEqual({
            value: startStats.respect,
            change: 0,
            status: 'MINED_OUT'
        })
    })
    test('should return null when trying get non-existing relation', () => {
        const fromChar = 'Char_A'
        const toChar = 'Char_B'
        const settings = {} as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)
        const rel = relManager.getRelation(fromChar, toChar)
        expect(rel).toBeNull()
    })
    test('updateAffinity should work correctly with delta === 0', () => {
        const fromChar = 'Char_A'
        const toChar = 'Char_B'
        const startStats = {
            affection: 20,
            respect: 1,
            trust: 8
        }
        const rel = {
            fromChar: fromChar,
            toChar: toChar,
            stats: {
                affection: startStats.affection,
                respect: startStats.respect,
                trust: startStats.trust
            }
        }
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)

        const res = relManager.updateAffinity(
            fromChar, toChar, {
                affection: 0,
                respect: 0, 
                trust: 0
            }
        )
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
    test('updateAffinity should work correctly with partial set of stats', () => {
        const fromChar = 'Char_A'
        const toChar = 'Char_B'
        const startStats = {
            affection: 20,
            respect: 1,
            trust: 8
        }
        const rel = {
            fromChar: fromChar,
            toChar: toChar,
            stats: {
                affection: startStats.affection,
                respect: startStats.respect,
                trust: startStats.trust
            }
        }
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)
        const delta = {
            respect: 1,
            trust: -2
        }
        const res = relManager.updateAffinity(fromChar, toChar, delta)

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
    test('updateAffinity should work correctly with empty set of stats', () => {
        const fromChar = 'Char_A'
        const toChar = 'Char_B'
        const startStats = {
            affection: 20,
            respect: 1,
            trust: 8
        }
        const rel = {
            fromChar: fromChar,
            toChar: toChar,
            stats: {
                affection: startStats.affection,
                respect: startStats.respect,
                trust: startStats.trust
            }
        }
        const settings = {
            relationships: [rel]
        } as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)

        const res = relManager.updateAffinity(
            fromChar, toChar, {}
        )
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
        const fromChar = 'Char_A'
        const toChar = 'Char_B'
        const settings = {} as unknown as PluginSettings

        const relManager = new RelationshipsManager(settings, mockedSave)

        expect(relManager.updateAffinity(fromChar, toChar, {})).toThrow('Relation not found')
    })
})