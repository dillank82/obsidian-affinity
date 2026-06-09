export const extractCodeBlockData = (block: string) => {
    const blockLines = block.split('\n')
    const blockData = blockLines.slice(1, -1).join('\n')
    return blockData
}