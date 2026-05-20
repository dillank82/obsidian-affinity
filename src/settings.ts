import { LogsHistory } from "interfaces/Logs";
import { Relationships } from "interfaces/Realtionships";

export interface PluginSettings {
	relationships: Relationships
	charactersDirectory: {
		path: string
		includeSubfolders: boolean
	}
	logsHistory: LogsHistory
}

export const DEFAULT_SETTINGS: PluginSettings = {
	relationships: {},
	charactersDirectory: {
		path: '',
		includeSubfolders: false
	},
	logsHistory: {}
}