import { debounce, FrontMatterCache, Notice, parseYaml, Plugin, TFile, TFolder } from 'obsidian'
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
import { WidgetPreviewMode } from 'WidgetPreviewMode';
import { extractCodeBlockData } from 'utils/codeBlockUtils/extractCodeBlockData/extractCodeBlockData';
import { validateCodeBlockData } from 'utils/codeBlockUtils/validateCodeBlockData/validateCodeBlockData';
import { listenIdByPathChanges } from 'listeners/listenIdByPathChanges';

export default class AffinityPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS
	idByPath: Map<string, CharacterID> = new Map()
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
			this.registerMarkdownPostProcessor((el, ctx) => {
				const codeBlocks: NodeListOf<HTMLElement> = el.querySelectorAll('.el-pre pre .language-affinity')
				codeBlocks.forEach(codeBl => {
					const info = ctx.getSectionInfo(codeBl)
					if (!info) return

					const lines = info.text.split('\n')
					const source = lines.slice(info.lineStart, info.lineEnd + 1).join('\n')
					const rawData: string = extractCodeBlockData(source)
					const { id, toCharId } = validateCodeBlockData(rawData, parseYaml, (err) => { new Notice(err instanceof Error ? err.message : String(err)) })

					const elPre = codeBl.parentElement?.parentElement
					if (elPre) {
						const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath)
						if (!(file instanceof TFile)) return
						const fromCharId = this.getAffinityIdCached(file)
						if (!fromCharId) return
						const child = new WidgetPreviewMode(elPre, this.app, id, fromCharId, toCharId)
						ctx.addChild(child)
					}
				})
			})
			//stub
			this.registerEditorExtension(affinityField(this.app.workspace.containerEl, this.app, () => ''))

			listenIdByPathChanges(this)
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

	async giveAffinityId(file: TFile): Promise<CharacterID> {
		const id = generateId()
		await this.updateMetadata(file, { affinityPluginId: id })
		return id
	}

	getAffinityIdCached(file: TFile): CharacterID {
		const cached = this.idByPath.get(file.path)
		if (cached) return cached

		const id = this.getAffinityId(file)
		this.idByPath.set(file.path, id)
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
		const chars = allFiles.map(async file => {
			const id = this.getAffinityId(file)
			this.idByPath.set(file.path, id)
			return { name: file.basename, id }
		})
		return await Promise.all(chars)
	}
}