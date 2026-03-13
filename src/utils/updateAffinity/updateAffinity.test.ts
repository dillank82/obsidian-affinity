import { Stats } from "interfaces/Stats"
import { updateAffinity } from "./updateAffinity"

describe('updateAffinity', () => {
    const createSampleRel = (overrides = {}): Stats => ({
        affection: 10,
        respect: 10,
        trust: 10,
        ...overrides
    })

    test('should correctly update relation', () => {
        const rel = createSampleRel()
        const startStats = { ...rel }
        const deltaStats = {
            affection: -1,
            respect: 1,
            trust: 4
        }
        const updatedRel = updateAffinity(rel, deltaStats)

        expect(updatedRel.newRel).toEqual({
            affection: startStats.affection + deltaStats.affection,
            respect: startStats.respect + deltaStats.respect,
            trust: startStats.trust + deltaStats.trust,
        })
        expect(updatedRel.result).toMatchObject({
            affection: {
                value: updatedRel.newRel.affection,
                change: deltaStats.affection,
                status: 'CHANGED'
            },
            respect: {
                value: updatedRel.newRel.respect,
                change: deltaStats.respect,
                status: 'CHANGED'
            },
            trust: {
                value: updatedRel.newRel.trust,
                change: deltaStats.trust,
                status: 'CHANGED'
            },
        })
    })
    test('should work correctly with partial set of stats', () => {
        const rel = createSampleRel()
        const startStats = { ...rel }
        const delta = {
            respect: 1,
            trust: -2
        }
        const updatedRel = updateAffinity(rel, delta)

        expect(updatedRel.result.affection).toEqual({
            value: startStats.affection,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(updatedRel.result.respect).toEqual({
            value: startStats.respect + delta.respect,
            change: delta.respect,
            status: 'CHANGED'
        })
        expect(updatedRel.result.trust).toEqual({
            value: startStats.trust + delta.trust,
            change: delta.trust,
            status: 'CHANGED'
        })
    })
    test('stats must not beat min and max edges after updating', () => {
        const rel = createSampleRel({ affection: 19, respect: 2 })
        const updatedRel = updateAffinity(rel, { affection: 20, respect: -20 })
        expect(updatedRel.result.affection).toEqual({
            value: 20,
            change: 1,
            status: 'MAXED_OUT'
        })
        expect(updatedRel.result.respect).toEqual({
            value: 1,
            change: -1,
            status: 'MINED_OUT'
        })
    })
    test('should work correctly with delta === 0', () => {
        const rel = createSampleRel()
        const startStats = { ...rel }

        const updatedRel = updateAffinity(
            rel, {
            affection: 0,
            respect: 0,
            trust: 0
        })
        expect(updatedRel.result.affection).toEqual({
            value: startStats.affection,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(updatedRel.result.respect).toEqual({
            value: startStats.respect,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(updatedRel.result.trust).toEqual({
            value: startStats.trust,
            change: 0,
            status: 'UNCHANGED'
        })
    })
    test('updateAffinity should work correctly with empty set of stats', () => {
        const rel = createSampleRel()
        const startStats = { ...rel }

        const updatedRel = updateAffinity(rel, {})
        expect(updatedRel.result.affection).toEqual({
            value: startStats.affection,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(updatedRel.result.respect).toEqual({
            value: startStats.respect,
            change: 0,
            status: 'UNCHANGED'
        })
        expect(updatedRel.result.trust).toEqual({
            value: startStats.trust,
            change: 0,
            status: 'UNCHANGED'
        })
    })
})