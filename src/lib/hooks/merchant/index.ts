import { API_URL } from '@/constants/env';
import { Token } from '@/lib/types/token';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Merchant {
    id: string;
    baseToken: Token;
    metadata: {
        name: string;
        description: string;
    };
    walletAddress: string;
    offerings: any[]; // Define a more specific type if needed
}

export interface CreateMerchantParams {
    id: string;
    baseToken: Token;
    metadata: {
        name: string;
        description: string;
    };
    walletAddress: string;
}

const fetchMerchantById = async (id: string): Promise<Merchant> => {
    const response = await fetch(`${API_URL}/api/merchants/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch merchant with ID ${id}`);
    }
    return response.json();
};
const fetchMerchantOfferings = async (id: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/api/merchants/${id}/offerings`);
    if (!response.ok) {
        throw new Error(`Failed to fetch offerings for merchant with ID ${id}`);
    }
    return response.json();
};

const fetchMerchantInvoices = async (id: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/api/merchants/${id}/invoices`);
    if (!response.ok) {
        throw new Error(`Failed to fetch invoices for merchant with ID ${id}`);
    }
    return response.json();
};

const fetchMerchantCustomers = async (id: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/api/merchants/${id}/customers`);
    if (!response.ok) {
        throw new Error(`Failed to fetch customers for merchant with ID ${id}`);
    }
    return response.json();
};

const fetchMerchantPayments = async (id: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/api/merchants/${id}/payments`);
    if (!response.ok) {
        throw new Error(`Failed to fetch payments for merchant with ID ${id}`);
    }
    return response.json();
};
const createMerchant = async (data: CreateMerchantParams): Promise<Merchant> => {
    const response = await fetch(`${API_URL}/api/merchants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create merchant');
    }

    return response.json();
};

export const useMerchant = () => {
    const queryClient = useQueryClient();

    // Fetch merchant by ID
    const useFetchMerchantById = (id: string) => {
        return useQuery<Merchant | null, Error>({
            queryKey: ['merchant', id],
            initialData: null,
            queryFn: () => fetchMerchantById(id),
        });
    };

    // Create a new merchant
    const useCreateMerchant = () => {
        return useMutation({
            mutationFn: createMerchant,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['merchants'] });
            },
            onError: (error) => {
                console.error('Merchant creation failed', error);
            },
        });
    };

    const useMerchantOfferings = (id: string) => {
        return useQuery({
            queryKey: ['merchant', id, 'offerings'],
            queryFn: () => fetchMerchantOfferings(id),
            initialData: [],
        });
    };

    const useMerchantInvoices = (id: string) => {
        return useQuery({
            queryKey: ['merchant', id, 'invoices'],
            queryFn: () => fetchMerchantInvoices(id),
            initialData: [],
        });
    };

    const useMerchantCustomers = (id: string) => {
        return useQuery({
            queryKey: ['merchant', id, 'customers'],
            queryFn: () => fetchMerchantCustomers(id),
            initialData: [],
        });
    };

    const useMerchantPayments = (id: string) => {
        return useQuery({
            queryKey: ['merchant', id, 'payments'],
            queryFn: () => fetchMerchantPayments(id),
            initialData: [],
        });
    };

    return {
        useFetchMerchantById,
        useCreateMerchant,
        useMerchantOfferings,
        useMerchantInvoices,
        useMerchantCustomers,
        useMerchantPayments
    };
};

