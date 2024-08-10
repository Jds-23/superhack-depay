import { useQuery } from '@tanstack/react-query';

export const usePrices = () => {
    const { data, isLoading, isError, error } = useQuery<{ [tokenKey: string]: number }>({
        queryKey: ['getAllPriceData'],
        queryFn: async () => {
            const res = await fetch('https://api.rhino.fi/market-data/getUsdtPrices');
            return res.json();
        },
        // staleTime: 60_000,
        refetchInterval: 600000,
    });

    return { data, isLoading, isError, error };
};
