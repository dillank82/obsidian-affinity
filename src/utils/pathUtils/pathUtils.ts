export const isInCharDir = (filePath: string, dirPath: string, includeSubfolders: boolean) => 
    filePath.startsWith(dirPath + "/") && (!filePath.slice(dirPath.length + 1).includes('/') || includeSubfolders)

export const isRenamed = (fileName: string, oldPath: string) => oldPath.substring(oldPath.lastIndexOf("/") + 1) !== fileName

export const isMoved = (filePath: string, oldPath: string) => 
    oldPath.substring(0, oldPath.lastIndexOf("/")) !== filePath.substring(0, filePath.lastIndexOf("/"))