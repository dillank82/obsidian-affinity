import { parseAffinityData } from "./validation"

describe('parseAffinityData', () => {
    it('should return data if it is valid', () => {
        const cache = {
            affinityPluginData: {
                George: {
                    affection: 10,
                    respect: 1,
                    trust: 20
                }
            }
        }
        expect(parseAffinityData(cache)).toEqual(cache.affinityPluginData)
    })
     it('should return null if data is null', () =>{
        expect(parseAffinityData(null)).toBeNull()
     })
     it('should return null if no affinityPluginData in cache', () =>{
        const cache = {
            someData: 'no affinity'
        }
        expect(parseAffinityData(cache)).toBeNull()
     })
     it('should return null if Stats is broken', () =>{
        const cache = {
            affinityPluginData: {
                John: {
                    affection: '42',
                    respect: undefined,
                    trust: [1,2,3]
                }
            }
        }
        expect(parseAffinityData(cache)).toBeNull()
     })
     it('should return null if data has extra keys', () =>{
        const cache = {
            affinityPluginData: {
                MM: {
                    affection: 14,
                    respect: 8,
                    trust: 2,
                    OCD: 3
                }
            }
        }
        expect(parseAffinityData(cache)).toBeNull()
     })
     it('should return null if data has lack of keys', () =>{
        const cache = {
            affinityPluginData: {
                Sven: {
                    affection: 14,
                    respect: 8
                }
            }
        }
        expect(parseAffinityData(cache)).toBeNull()
     })
     it('should return null if cache is not object', () =>{
        const cache = [1]
        expect(parseAffinityData(cache)).toBeNull()
     })
})