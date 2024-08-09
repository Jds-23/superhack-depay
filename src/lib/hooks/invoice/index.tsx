import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Invoice {
    id: number;
    date: string;
    paid: boolean;
    customer: any; // Replace 'any' with the actual Customer type
    offering: any; // Replace 'any' with the actual Offering type
}

export interface CreateInvoiceParams {
    offeringId: number;
    customerId: number;
    // Add more fields if needed
}

const fetchInvoiceById = async (id: number): Promise<Invoice> => {
    const response = await fetch(`/api/invoices/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch invoice with ID ${id}`);
    }
    return response.json();
};

const createInvoice = async (data: CreateInvoiceParams): Promise<Invoice> => {
    const response = await fetch('/api/invoices', {
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