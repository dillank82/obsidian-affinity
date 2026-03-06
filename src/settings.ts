import { Relationships } from "interfaces/Realtionships";

export interface PluginSettings {
	relationships: Relationships
}

export const DEFAULT_SETTINGS: PluginSettings = {
	relationships: {}
}