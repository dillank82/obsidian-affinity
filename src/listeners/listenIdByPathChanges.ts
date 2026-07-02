import AffinityPlugin from "main";
import { registerVaultEvent } from "./registerVaultEvent";
import { TAbstractFile, TFile } from "obsidian";

export const listenIdByPathChanges = (plugin: AffinityPlugin) => {
    const isTFile = (file: TAbstractFile) => file instanceof TFile
    const invalidatePath = (file: TAbstractFile) => plugin.idByPath.delete(file.path)

    plugin.registerEvent(
        plugin.app.metadataCache.on('changed', invalidatePath)
    )

    registerVaultEvent(
        plugin,
        'rename',
        (file, oldPath) => {
            const id = plugin.idByPath.get(oldPath)
            plugin.idByPath.delete(oldPath)
            if (id) plugin.idByPath.set(file.path, id)
        },
        isTFile
    )

    registerVaultEvent(
        plugin,
        'delete',
        invalidatePath,
        isTFile
    )
}