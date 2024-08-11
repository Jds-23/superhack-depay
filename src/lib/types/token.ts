import { z } from 'zod';
export const ethereumAddressSchema = z.string().refine((val) => {
    return /^0x[a-fA-F0-9]{40}$/.test(val);
}, {
    message: "Invalid Ethereum address",
});
// Define the Zod schema
export const TokenSchema = z.object({
    symbol: z.string(),
    address: ethereumAddressSchema,
    chainId: z.string(), // Changed to string
    decimals: z.number(),
});

// Derive the TypeScript type from the schema
export type Token = z.infer<typeof TokenSchema>;

