/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AffinityPlugin from "main"
import { TAbstractFile } from "obsidian"

export function registerVaultEvent(
    plugin: AffinityPlugin, 
    eventType: 'create' | 'delete' | 'modify', 
    callback: (file: TAbstractFile) => unknown,
    condition?: (file: TAbstractFile) => boolean
): void

export function registerVaultEvent(
    plugin: AffinityPlugin, 
    eventType: 'rename', 
    callback: (file: TAbstractFile, oldPath: string) => unknown,
    condition?: (file: TAbstractFile, oldPath: string) => boolean
): void

export function registerVaultEvent(
    plugin: AffinityPlugin, 
    eventType: string, 
    callback: (...args: any[]) => unknown,
    condition?: (...args: any[]) => boolean
): void {
    plugin.registerEvent(
        plugin.app.vault.on(eventType as any, async (...args: any[]) => {
            if (!condition || condition(...args)) {
                await callback(...args)
            }
        })
    )
}