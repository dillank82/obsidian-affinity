import AffinityPlugin from "main";
import { TAbstractFile } from "obsidian";
import { Store } from "store";
import { registerVaultEvent } from "./registerVaultEvent";
import { isInCharDir, isMoved, isRenamed } from "utils/pathUtils/pathUtils";

export const listenCharFileChanges = async (plugin: AffinityPlugin, store: Store) => {
    const dirPath = plugin.settings.charactersDirectory.path
    const includeSubfolders = plugin.settings.charactersDirectory.includeSubfolders

    const charDirCon = (file: TAbstractFile) => isInCharDir(file.path, dirPath, includeSubfolders)
    const isRenamedOrMoved = (file: TAbstractFile, oldPath: string) => isRenamed(file.name, oldPath) || isMoved(file.path,oldPath)

    const refreshChars = async () => {
        const chars = await plugin.getChars()
        store.setChars(chars)
    }

    registerVaultEvent(plugin, 'create', refreshChars, charDirCon)
    registerVaultEvent(plugin, 'delete', refreshChars, charDirCon)
    registerVaultEvent(plugin, 'rename', refreshChars, isRenamedOrMoved)
}