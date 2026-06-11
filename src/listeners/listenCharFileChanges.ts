import AffinityPlugin from "main";
import { TAbstractFile } from "obsidian";
import { Store } from "store";
import { registerVaultEvent } from "./registerVaultEvent";
import { isInCharDir, isMoved, isRenamed } from "utils/pathUtils/pathUtils";

export const listenCharFileChanges = async (plugin: AffinityPlugin, store: Store) => {
    const dirPath = plugin.settings.charactersDirectory.path
    const includeSubfolders = plugin.settings.charactersDirectory.includeSubfolders

    const charDirCon = (file: TAbstractFile) => isInCharDir(file.path, dirPath, includeSubfolders)

    const isRenamedCon = (file: TAbstractFile, oldPath: string) => charDirCon(file) && isRenamed(file.name, oldPath)

    const isMovedInCon = (file: TAbstractFile, oldPath: string) => charDirCon(file) && isMoved(file.path,oldPath)
    const isMovedOutCon = (file: TAbstractFile, oldPath: string) => isInCharDir(oldPath, dirPath, includeSubfolders) && isMoved(file.path,oldPath)
    const isMovedCon = (file: TAbstractFile, oldPath: string) => isMovedInCon(file, oldPath) || isMovedOutCon(file, oldPath)

    const isRenamedOrMoved = (file: TAbstractFile, oldPath: string) => isRenamedCon(file, oldPath) || isMovedCon(file, oldPath)

    const refreshChars = async () => {
        const chars = await plugin.getChars()
        store.setChars(chars)
    }

    registerVaultEvent(plugin, 'create', refreshChars, charDirCon)
    registerVaultEvent(plugin, 'delete', refreshChars, charDirCon)
    registerVaultEvent(plugin, 'rename', refreshChars, isRenamedOrMoved)
}