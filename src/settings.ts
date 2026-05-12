import { Relationships } from "interfaces/Realtionships";

export interface PluginSettings {
	relationships: Relationships
	charactersDirectory: {
		path: string
		includeSubfolders: boolean
	}
}

export const DEFAULT_SETTINGS: PluginSettings = {
	relationships: {},
	charactersDirectory: {
		path: '',
		includeSubfolders: false
	}
}