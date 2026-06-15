import z from "zod";

export const MarkdownCodeBlockDataSchema = z.object({
    id: z.uuid(),
    toCharId: z.uuid().nullish().transform(val => val === undefined ? null : val)
})
export type MarkdownCodeBlockData = z.infer<typeof MarkdownCodeBlockDataSchema>