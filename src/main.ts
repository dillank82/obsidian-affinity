import { debounce, FrontMatterCache, Plugin, TFile } from 'obsidian'
import { DEFAULT_SETTINGS, PluginSettings } from "./settings"
import { AffinityProcessor } from 'processors/AffinityProcessor';
import { CharacterID } from 'interfaces/Realtionships';
import { useStore } from 'store';
import { RelationshipsManager } from 'core/RelationshipsManager';
import { generateId } from 'utils/generateId';

export default class AffinityPlugin extends Plugin {
	settings: PluginSettings
	private relManager: RelationshipsManager
  	private processor: AffinityProcessor

	async onload() {
		await this.loadSettings();

		const debouncedSave = debounce(async() => { await this.saveSettings() }, 1000)
		useStore.setState({ relationships: this.settings.relationships })
		useStore.subscribe((state) => {
			this.settings = {
				...this.settings,
				relationships: state.relationships
			}
			debouncedSave()
		})
		this.relManager = new RelationshipsManager(useStore.getState())
		this.processor = new AffinityProcessor()
		this.registerMarkdownCodeBlockProcessor('affinity', async (source, el, ctx) => {
			const id = await this.getAffinityId(this.app.workspace.getActiveFile())
			await this.processor.process(source, el, ctx, this.relManager, id)
		})
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<PluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private getFrontmatter(file: TFile | null): FrontMatterCache | null {
		if (!file) return null
		const cache = this.app.metadataCache.getFileCache(file)?.frontmatter
		return cache || null
	}

	async getAffinityId(file: TFile | null): Promise<CharacterID> {
		if (!file) throw new Error ('No file is active')
		const cache = this.getFrontmatter(file)
		let id: unknown = cache?.affinityPluginId
		if (!cache || !id) {
			id = await this.giveAffinityId(file)
		}
		if (typeof id !== 'string') throw new Error('Frontmatter data is corrupted')
		return id
	}

	private async giveAffinityId(file: TFile): Promise<CharacterID> {
		const id = generateId()
		await this.updateMetadata(file, { affinityPluginId: id })
		return id
	}

	private async updateMetadata(file: TFile, data: unknown) {
		try {
			await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
				Object.assign(frontmatter, data)
			})
		} catch (e) {
			console.error("Frontmatter update error:", e)
		}
	}
}