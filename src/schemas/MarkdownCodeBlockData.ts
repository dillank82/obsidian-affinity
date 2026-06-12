import z from "zod";

export const MarkdownCodeBlockDataSchema = z.object({
    id: z.uuid(),
    toCharId: z.uuid().nullable()
})
export type MarkdownCodeBlockData = z.infer<typeof MarkdownCodeBlockDataSchema>