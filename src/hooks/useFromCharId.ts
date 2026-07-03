import { useApp } from 'context';
import { TFile } from 'obsidian';
import { useSyncExternalStore } from 'react';
import { getAffinityId } from 'utils/getAffinityId';

export const useFromCharId = (file: TFile) => {
    const app = useApp()
    const subscribe = (callback: () => void) => {
        const eventRef = app.metadataCache.on('changed', (f) => {
            if (f.path === file.path) callback()
        })

        return () => {
            app.metadataCache.offref(eventRef)
        }
    }

    const getSnapshot = (): string => getAffinityId(file, app)

    return useSyncExternalStore(subscribe, getSnapshot)
}