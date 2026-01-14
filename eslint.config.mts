import tseslint from 'typescript-eslint';
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import { globalIgnores } from "eslint/config";
import jestPlugin from 'eslint-plugin-jest'

export default tseslint.config(
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						'eslint.config.js',
						'manifest.json'
					]
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.json']
			},
		},
	},
	...obsidianmd.configs.recommended,
	globalIgnores([
		"node_modules",
		"dist",
		"esbuild.config.mjs",
		"eslint.config.js",
		"version-bump.mjs",
		"versions.json",
		"main.js",
	]),
	{
		files: ['**/*.test.ts', '**/*.spec.ts'],
		plugins: {
			jest: jestPlugin
		},
		languageOptions: {
			globals: {
				...globals.jest
			}
		},
		rules: {
			...jestPlugin.configs.recommended.rules,
			'jest/no-disabled-tests': 'warn',
   			'jest/no-focused-tests': 'error',
		}
	}
);
