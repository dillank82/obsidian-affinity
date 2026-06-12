export const getCodeBlockLanguage = (block: string) => {
    if (block.startsWith("```")) {
        return block.split('\n')[0]!.slice(3)
    } else return ''
}