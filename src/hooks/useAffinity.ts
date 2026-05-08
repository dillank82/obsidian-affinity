import { EditorView } from "@codemirror/view"
import { useApp } from "context"
import { Character, CharacterID } from "interfaces/Realtionships"
import { Stats } from "interfaces/Stats"
import { UseAffinityReturn, UseAffinityState } from "interfaces/useAffinity"
import { MarkdownView, Notice } from "obsidian"
import { useState } from "react"
import { findBlockRanges, updateMarkdownData } from "services/WriteService/WriteService"
import { Store } from "store"
import { mapStats } from "utils/mapStats"

export const useAffinity = (store: Store, fromChar: CharacterID, initialToCharId: CharacterID | null, characters: Character[], codeBlockId: string): UseAffinityReturn => {
    const app = useApp()

    const findCharName = (charId: CharacterID) => characters.find(char => char.id === charId)?.name
    const getInitialToChar = () => {
        if (!initialToCharId) return null
        const name = findCharName(initialToCharId)
        if (!name) return null
        return {
            id: initialToCharId,
            name: name
        }
    }
    const getInitialState = (): UseAffinityState => {
        const toChar = getInitialToChar()
        if (!toChar) {
            return {
                status: 'initial',
                toChar
            }
        } else {
            return {
                status: 'chosen',
                toChar
            }
        }
    }
    const [state, setState] = useState<UseAffinityState>(getInitialState())

    const writeToCharChanges = (toCharId: string) => {
        try {
            const editor = app.workspace.getActiveViewOfType(MarkdownView)?.editor
            // A necessary hack to gain access to the private CodeMirror API
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            const editorView = (editor as any).cm as EditorView
            if (!editor || !editorView) {
                new Notice('Failed to save character selection. No active editor.')
                return
            }

            const state = editorView.state
            const ranges = findBlockRanges(state, codeBlockId)
            if (!ranges) {
                new Notice('Failed to save character selection: cannot find current code block range.')
                return
            }
            const { from, to } = ranges
            
            const data = {
                id: codeBlockId,
                toCharId: toCharId
            }
            updateMarkdownData(editor, data, from, to)
        } catch(err) {
            const errMsg = err instanceof Error ? err.message : String(err)
            new Notice(`Unexpected error while trying to save character selection: ${errMsg}.`)
        }
    }

    const setToChar = (toChar: CharacterID) => {
        setState({
            status: 'chosen',
            toChar: {
                id: toChar,
                name: findCharName(toChar)!
            }
        })
        writeToCharChanges(toChar)
    }

    const createRel = (toChar: CharacterID) => {
        store.createRelation(fromChar, toChar)
    }

    const relations = store.relationships[fromChar]
    const relOptions = Object.keys(relations || {}).map(key => ({
        id: key,
        name: findCharName(key)!
    }))

    const initialReturn = {
        toChar: null,
        stats: null,
        labels: null,
        updateAffinity: null,
        relOptions: relOptions,
        createRel,
        setToChar
    }

    if (state.status === 'initial') {
        return {
            status: state.status,
            ...initialReturn
        }
    }

    const toChar = state.toChar
    const stats = relations?.[toChar.id] || null

    if (!stats) {
        return {
            ...initialReturn,
            status: "no_stats",
            toChar: toChar
        }
    }

    const labels = mapStats(stats)

    const updateAffinity = (delta: Partial<Stats>) => {
        store.updateRelation(fromChar, toChar.id, delta)
    }

    return { status: state.status, toChar, setToChar, stats, labels, updateAffinity, createRel, relOptions }
}