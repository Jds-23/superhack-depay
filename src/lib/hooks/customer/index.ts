import { MetadataSchema } from "@/lib/types/metadata";
import { ethereumAddressSchema, TokenSchema } from "@/lib/types/token";
import { z } from "zod";

export const createCustomerSchema = z.object({
    walletAddress: ethereumAddressSchema,
    email: z.string().optional(),
    baseToken: TokenSchema.optional(),
    metadata: MetadataSchema.optional(),
});

export type CreateCustomerType = z.infer<typeof createCustomerSchema>;