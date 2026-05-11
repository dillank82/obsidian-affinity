import { Relationships } from "interfaces/Realtionships";

export interface PluginSettings {
	relationships: Relationships
	charactersDirectory: string
}

export const DEFAULT_SETTINGS: PluginSettings = {
	relationships: {},
	charactersDirectory: ''
}