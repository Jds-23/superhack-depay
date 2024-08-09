import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Token } from '../types/token';
import { Metadata } from '../types/metadata';
import { API_URL } from '@/constants/env';

export interface Offering {
    id: number;
    metadata: Metadata;
    price: bigint;
    customToken: Token;
    stock: number;
    isUnlimited: boolean;
    isLive: boolean;
}

export interface CreateOfferingParams {
    metadata: Metadata;
    price: string; // string because we're converting to BigInt later
    customToken: Token;
    stock: number;
    isUnlimited: boolean;
    isLive: boolean;
    merchantId: string;
}

const fetchOfferingById = async (id: number): Promise<Offering> => {
    const response = await fetch(`${API_URL}/api/offerings/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch offering');
    }
    return response.json();
};

const createOffering = async (data: CreateOfferingParams): Promise<Offering> => {
    const response = await fetch(`${API_URL}/api/offerings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create offering');
    }

    return response.json();
};

export const useOffering = () => {
    const queryClient = useQueryClient();

    // Fetch offering by ID
    const useFetchOfferingById = (id: number) => {
        return useQuery({
            queryKey: ['offering', id],
            initialData: null,
            queryFn: () => fetchOfferingById(id),
        });
    };

    // Create new offering
    const useCreateOffering = () => {
        return useMutation({
            mutationFn: createOffering,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['offerings'] });
            },
            onError: (error) => {
                console.error('Offering creation failed', error);
            },
        }
            //     {
            //     onSuccess: () => {
            //         queryClient.invalidateQueries(['offerings']);
            //     },
            // }
        );
    };

    return {
        useFetchOfferingById,
        useCreateOffering,
    };
};