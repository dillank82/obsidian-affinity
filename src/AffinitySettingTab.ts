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
                dropdown.addOptions(folderOptions)
                dropdown.setValue(this.plugin.settings.charactersDirectory)
                dropdown.onChange(async (value) => {
                    this.plugin.settings.charactersDirectory = value
                    await this.plugin.saveSettings()
                })
            })
    }
}