import { parseYaml } from "obsidian"

export type YamlParser = (yaml: string) => any

export const parseYamlObsidian: YamlParser = parseYaml