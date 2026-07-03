import { CharacterID } from "interfaces/Realtionships"
import { App, FrontMatterCache, TFile } from "obsidian"

export const getAffinityId = (file: TFile, app: App): CharacterID => {
    const cache: FrontMatterCache | undefined = app.metadataCache.getFileCache(file)?.frontmatter
    let id: unknown = cache?.affinityPluginId
    if (!id) throw new Error("Can't get character id from metadata cache")
    if (typeof id !== 'string') throw new Error('Frontmatter data is corrupted')
    return id
}