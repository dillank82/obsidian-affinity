import { debounce, FrontMatterCache, Plugin, TFile } from 'obsidian'
import { DEFAULT_SETTINGS, PluginSettings } from "./settings"
import { AffinityProcessor } from 'processors/AffinityProcessor';
import { Character, CharacterID } from 'interfaces/Realtionships';
import { useStore } from 'store';
import { generateId } from 'utils/generateId';
import { addCommands } from 'commands';
import { AffinitySettingTab } from 'AffinitySettingTab';
import { getFilesByFolder } from 'utils/getFilesByFolder';

export default class AffinityPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS
  	private processor: AffinityProcessor = new AffinityProcessor()

	async onload() {
		await this.loadSettings();
		addCommands(this)
		this.addSettingTab(new AffinitySettingTab(this))

		const debouncedSave = debounce(async() => { await this.saveSettings() }, 1000)
		useStore.setState({ relationships: this.settings.relationships })
		useStore.subscribe((state) => {
			this.settings = {
				...this.settings,
				relationships: state.relationships
			}
			debouncedSave()
		})
		this.registerMarkdownCodeBlockProcessor('affinity', async (source, el, ctx) => {
			const id = await this.getAffinityId(this.app.workspace.getActiveFile())
			const charsList = await this.getChars()
			await this.processor.process(source, el, ctx, id, charsList, this.app)
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

	private async getChars(): Promise<Character[]> {
		const allFiles = getFilesByFolder(this.app, this.settings.charactersDirectory)
		const chars = allFiles.map(async file => ({
			name: file.basename,
			id: await this.getAffinityId(file)
		}))
		return await Promise.all(chars)
	}
}