import { z } from "zod";

export const MetadataSchema = z.object({
    name: z.string().min(4, "Name must be at least 4 characters long"),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
});

export type Metadata = z.infer<typeof MetadataSchema>;
