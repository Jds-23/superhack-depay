import { API_URL } from '@/constants/env';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { createCustomerSchema } from '../customer';
import { createOfferingSchema } from '../useOfferings';

export interface Invoice {
    id: number;
    date: string;
    paid: boolean;
    customer: any; // Replace 'any' with the actual Customer type
    offering: any; // Replace 'any' with the actual Offering type
}

// Define the Zod schema for Invoice creation
const createInvoiceSchema = z.object({
    // customer: Create
    offeringId: z.number().optional(),
    offering: createOfferingSchema.optional(),
    customerId: z.string().optional(),
    customer: createCustomerSchema.optional(),
    date: z.string(),
});

export type CreateInvoiceType = z.infer<typeof createInvoiceSchema>;

const fetchInvoiceById = async (id: number): Promise<Invoice> => {
    const response = await fetch(`${API_URL}/api/invoices/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch invoice with ID ${id}`);
    }
    return response.json();
};

const createInvoice = async (data: CreateInvoiceType): Promise<Invoice> => {
    const response = await fetch(`${API_URL}/api/invoices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create invoice');
    }

    return response.json();
};
export const useInvoice = () => {
    const queryClient = useQueryClient();

    // Fetch an invoice by ID
    const useFetchInvoiceById = (id: number) => {
        return useQuery<Invoice | null, Error>({
            queryKey: ['invoice', id],
            queryFn: () => fetchInvoiceById(id),
            initialData: null,
        });
    };

    // Create a new invoice
    const useCreateInvoice = () => {
        return useMutation({
            mutationFn: createInvoice,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['invoices'] });
            },
            onError: (error) => {
                console.error('Invoice creation failed', error);
            },
        });
    };

    return {
        useFetchInvoiceById,
        useCreateInvoice,
    };
};