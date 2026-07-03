import { useApp } from 'context';
import { TFile } from 'obsidian';
import { useSyncExternalStore } from 'react';

export const useFromCharId = (file: TFile | null) => {
    if (!file) return null
    const app = useApp()
    const subscribe = (callback: () => void) => {
        const eventRef = app.metadataCache.on('changed', (f) => {
            if (f.path === file.path) callback()
        })

        return () => {
            app.metadataCache.offref(eventRef)
        }
    }

    const getSnapshot = (): string | null => {
        const cache = app.metadataCache.getFileCache(file)
        const frontmatter = cache?.frontmatter
        if (!frontmatter) return null
        const id: unknown = frontmatter.affinityPluginId
        if (!(typeof id === 'string')) return null
        return id
    }

    return useSyncExternalStore(subscribe, getSnapshot)
}