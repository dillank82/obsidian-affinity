import { debounce, FrontMatterCache, Plugin, TFile, TFolder } from 'obsidian'
import { DEFAULT_SETTINGS, PluginSettings } from "./settings"
import { AffinityProcessor } from 'processors/AffinityProcessor';
import { Character, CharacterID } from 'interfaces/Realtionships';
import { useStore } from 'store';
import { generateId } from 'utils/generateId';
import { addCommands } from 'commands';
import { AffinitySettingTab } from 'AffinitySettingTab';
import { getFilesByFolder } from 'utils/getFilesByFolder';
import { listenCharFileChanges } from 'listeners/listenCharFileChanges';
import { affinityField } from 'inlineLivePreview';

export default class AffinityPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS
	private processor: AffinityProcessor = new AffinityProcessor()

	async onload() {
		await this.loadSettings();
		addCommands(this)
		this.addSettingTab(new AffinitySettingTab(this))

		this.registerEvent(
			this.app.vault.on('rename', async (file, oldPath) => {
				if (!(file instanceof TFolder)) return
				if (oldPath !== this.settings.charactersDirectory.path) return
				this.settings.charactersDirectory.path = file.path
				await this.saveSettings()
			})
		)

		this.app.workspace.onLayoutReady(async () => {
			const initialChars = await this.getChars()
			useStore.setState({
				relationships: this.settings.relationships,
				chars: initialChars,
				historyMap: this.settings.logsHistoryMap
			})
			const getId = () => this.getAffinityId(this.app.workspace.getActiveFile())
			this.registerMarkdownCodeBlockProcessor('affinity', async (source, el, ctx) => {
				await this.processor.process(source, el, ctx, getId(), this.app)
			})
			this.registerEditorExtension(affinityField(this.app.workspace.containerEl, this.app, getId))

			await listenCharFileChanges(this, useStore.getState())
		})

		const debouncedSave = debounce(async () => { await this.saveSettings() }, 1000)
		useStore.subscribe((state) => {
			this.settings = {
				...this.settings,
				relationships: state.relationships,
				logsHistoryMap: state.historyMap
			}
			debouncedSave()
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

	getAffinityId(file: TFile | null): CharacterID {
		if (!file) throw new Error('No file is active')
		const cache = this.getFrontmatter(file)
		let id: unknown = cache?.affinityPluginId
		if (!cache || !id) throw new Error("Can't get character id from metadata cache")
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

	async getChars(): Promise<Character[]> {
		const allFiles = getFilesByFolder(this.app, this.settings.charactersDirectory.path, this.settings.charactersDirectory.includeSubfolders)
		const chars = allFiles.map(async file => ({
			name: file.basename,
			id: this.getAffinityId(file)
		}))
		return await Promise.all(chars)
	}
}