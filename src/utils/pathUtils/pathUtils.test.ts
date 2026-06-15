import { isInCharDir, isMoved, isRenamed } from "./pathUtils"

describe('isInCharDir', () => {
    it('should return true if file is exactly in the dir', () => {
        expect(isInCharDir('chars/file', 'chars', false)).toBe(true)
    })
    it('should return true for subfolder if includeSubfolders is true', () => {
        expect(isInCharDir('chars/good/file', 'chars', true)).toBe(true)
    })
    it('should return false for subfolder if includeSubfolders is false', () => {
        expect(isInCharDir('chars/good/file', 'chars', false)).toBe(false)
    })
    it('should return false for partial dir path match', () => {
        expect(isInCharDir('chars2/good/file', 'chars', true)).toBe(false)
    })
    it('should return false for files in different directories', () => {
        expect(isInCharDir('others/not_a_hero.md', 'characters', false)).toBe(false)
    })
})

describe('isRenamed', () => {
    it('should return true if old path contains different file name', () => {
        expect(isRenamed('John', 'chars/JDH')).toBe(true)
    })
    it('should return false if old path contains file name', () => {
        expect(isRenamed('John', 'chars/John')).toBe(false)
    })
    it('should return true for partial match', () => {
        expect(isRenamed('John', 'chars/Johnny')).toBe(true)
    })
    it('should work correctly with root dir files', () => {
        expect(isRenamed('John', 'John')).toBe(false)
    })
    it('should work correctly with deep nested files', () => {
        expect(isRenamed('John', 'core/notes/chars/main/active/JDH')).toBe(true)
    })
})

describe('isMoved', () => {
    it('should return true if paths have same file name, but different dirs', () => {
        expect(isMoved('comets/Valora', 'chars/Valora')).toBe(true)
    })
    it('should return false if paths have same different dirs', () => {
        expect(isMoved('chars/Dawnbreaker', 'chars/Valora')).toBe(false)
    })
    it('should handle move from root to folder', () => {
        expect(isMoved('chars/Valora', 'Valora')).toBe(true)
    })
    it('should handle move from folder to root', () => {
        expect(isMoved('Valora', 'chars/Valora')).toBe(true)
    })
})