import AffinityPlugin from "main";
import { PluginSettingTab, Setting } from "obsidian";

export class AffinitySettingTab extends PluginSettingTab {
    plugin: AffinityPlugin

    constructor(plugin: AffinityPlugin) {
        super(plugin.app, plugin)
        this.plugin = plugin
    }

    display(): void {
        const { containerEl } = this
        containerEl.empty()

        const folders = this.app.vault.getAllFolders(true)
        const folderOptions: Record<string, string> = {}
        folders.forEach(folder => {
            folderOptions[folder.name] = folder.path
        })

        new Setting(containerEl)
            .setName('Characters directory')
            .setDesc('Directory where plugin will initialize notes as characters')
            .addDropdown((dropdown) => {
                dropdown
                    .addOptions(folderOptions)
                    .setValue(this.plugin.settings.charactersDirectory.path)
                    .onChange(async (value) => {
                        this.plugin.settings.charactersDirectory.path = value
                        await this.plugin.saveSettings()
                    })
            })
        new Setting(containerEl)
            .setName("Including subfolders content")
            .addToggle(toggle => {
                toggle
                    .setValue(this.plugin.settings.charactersDirectory.includeSubfolders)
                    .onChange(async (value) => {
                        this.plugin.settings.charactersDirectory.includeSubfolders = value
                        await this.plugin.saveSettings()
                    })
            })
    }
}