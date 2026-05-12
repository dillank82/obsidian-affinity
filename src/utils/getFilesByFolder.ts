import { App, Notice, TFile, TFolder } from "obsidian";

export const getFilesByFolder = (app: App, folderPath: string, includeSubfolders: boolean): TFile[] => {
    const abstractFile = app.vault.getAbstractFileByPath(folderPath);

    if (!(abstractFile instanceof TFolder)) {
        new Notice("Please choose characters folder for affinity plugin work")
        return []
    }

    let files: TFile[] = []

    for (const child of abstractFile.children) {
        if (child instanceof TFile) {
            files.push(child)
        } else if (child instanceof TFolder && includeSubfolders) {
            files = files.concat(getFilesByFolder(app, child.path, includeSubfolders));
        }
    }
    return files
}