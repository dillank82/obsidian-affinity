import AffinityPlugin from "main";
import { TAbstractFile } from "obsidian";
import { Store } from "store";
import { registerVaultEvent } from "./registerVaultEvent";

export const listenCharFileChanges = async (plugin: AffinityPlugin, store: Store) => {
    const dirPath = plugin.settings.charactersDirectory.path
    const includeSubfolders = plugin.settings.charactersDirectory.includeSubfolders

    const inCharDir = (file: TAbstractFile) => file.path === dirPath || (includeSubfolders && file.path.startsWith(dirPath))
    const isRenamed = (file: TAbstractFile, oldPath: string) => oldPath.substring(oldPath.lastIndexOf("/") + 1) !== file.name
    const isMoved = (file: TAbstractFile, oldPath: string) => 
        oldPath.substring(0, oldPath.lastIndexOf("/")) !== file.path.substring(0, file.path.lastIndexOf("/"))
    const isRenamedOrMoved = (file: TAbstractFile, oldPath: string) => isRenamed(file, oldPath) || isMoved (file,oldPath)

    const refreshChars = async () => {
        const chars = await plugin.getChars()
        store.setChars(chars)
    }

    registerVaultEvent(plugin, 'create', refreshChars, inCharDir)
    registerVaultEvent(plugin, 'delete', refreshChars, inCharDir)
    registerVaultEvent(plugin, 'rename', refreshChars, isRenamedOrMoved)
}