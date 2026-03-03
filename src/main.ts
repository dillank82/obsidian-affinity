import { App, Editor, MarkdownView, Modal, Notice, Plugin, TFile, WorkspaceLeaf } from 'obsidian'
import { AffinitySettingsTab, DEFAULT_SETTINGS, PluginSettings } from "./settings"
import { AffinityData } from 'interfaces/AffinityData';
import { parseAffinityData } from 'validation';
import { AffinityProcessor } from 'processors/AffinityProcessor';

export default class AffinityPlugin extends Plugin {
	settings: PluginSettings

	async onload() {
		await this.loadSettings();

		const data = this.getMetadata(this.app.workspace.getActiveFile())
		const processor = new AffinityProcessor()
		this.registerMarkdownCodeBlockProcessor('affinity', async (source, el, ctx) => {
			await processor.process(source, el, ctx, data)
		})

		this.addRibbonIcon('dice', 'Activate view', async (evt: MouseEvent) => {})

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status bar text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-modal-simple',
			name: 'Open modal (simple)',
			callback: () => {
				new AffinityModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'replace-selected',
			name: 'Replace selected content',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection('Sample editor command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-modal-complex',
			name: 'Open modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new AffinityModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
				return false;
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new AffinitySettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			new Notice("Click");
		});
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<PluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView(viewType: string) {
		const { workspace } = this.app
		let leaf: WorkspaceLeaf | null = null
		const leaves = workspace.getLeavesOfType(viewType)
		if (leaves.length > 0) {
			leaf = leaves[0] || null
		} else {
			leaf = workspace.getRightLeaf(false)
			await leaf?.setViewState({ type: viewType, active: true })
		}
		if (leaf) await workspace.revealLeaf(leaf)
	}

	getMetadata(file: TFile | null): AffinityData | null {
		if (!file) return null
		const cache = this.app.metadataCache.getFileCache(file)?.frontmatter || null
		return parseAffinityData(cache)
	}

	async updateMetadata(file: TFile, data: AffinityData) {
		const affinityData = {
			affinityPluginData: data
		}
		try {
			await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
				Object.assign(frontmatter, affinityData)
			})
		} catch (e) {
			console.error("Ошибка при обновлении Frontmatter:", e)
		}
	}
}

class AffinityModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
