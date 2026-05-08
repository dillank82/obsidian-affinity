import { parseYaml } from "obsidian"

export type YamlParser = (yaml: string) => unknown

export const parseYamlObsidian: YamlParser = parseYaml