import { MarkdownCodeBlockData } from "schemas/MarkdownCodeBlockData";

export const dataToMarkdownContent = (data: MarkdownCodeBlockData) => {
    const content = [
        '```affinity',
        `  id: ${data.id}`
    ]
    if (data.toCharId) content.push(`  toCharId: ${data.toCharId}`)
    content.push('```')
    return content.join('\n') + '\n'
}