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
})