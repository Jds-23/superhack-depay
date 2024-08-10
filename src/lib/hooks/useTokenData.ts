import { ChainIds } from '@/constants/chains';
import { CHAINS_DATA, EVM_CHAINS } from '@/constants/chains/list';
import { TOKEN_SYMBOL_MAP, Token } from '@/constants/tokens';
import { isTokenETH } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getBalance, getToken } from '@wagmi/core';
import { useMemo } from 'react';
import { useConfig } from 'wagmi';

export const useToken = ({
    chainId,
    tokenAddress,
}: {
    chainId: ChainIds | undefined;
    tokenAddress: string;
}) => {

    const tokenList = useMemo(() => {
        if (!chainId) return [];
        if (!TOKEN_SYMBOL_MAP[chainId]) return [];

        return Object.values(TOKEN_SYMBOL_MAP[chainId])
    }, [chainId]);

    return tokenList.find((t) => t.address.toLowerCase() === tokenAddress.toLowerCase());
};

const useTokenData = ({
    chainId,
    tokenAddress,
    account,
}: {
    chainId: ChainIds;
    tokenAddress: string;
    account: string;
}) => {
    const config = useConfig();

    const { data: tokenData, ...restTokenQueryData } = useQuery({
        queryKey: ['tokenData', chainId, tokenAddress],
        queryFn: async () => {
            if (!tokenAddress) throw new Error('address is required');
            // if chainId is for evm chain
            if (EVM_CHAINS.find((c) => c === chainId)) {
                // const balance = await getBalance(config, {
                //   chainId: Number(chainId),
                //   address: account as `0x${string}`,
                //   token: !isTokenETH(tokenAddress) ? (tokenAddress as `0x${string}`) : undefined,
                // });

                if (isTokenETH(tokenAddress))
                    return {
                        // balance,
                        name: CHAINS_DATA[chainId].nativeCurrency.name,
                        symbol: CHAINS_DATA[chainId].nativeCurrency.symbol,
                        decimals: CHAINS_DATA[chainId].nativeCurrency.decimals,
                    };

                const tokenData = await getToken(config, { chainId: Number(chainId), address: tokenAddress as `0x${string}` });
                return {
                    // balance,
                    ...tokenData,
                };
            }
        },
        staleTime: 86_400_000, // 1 day
    });
    const { data: tokenBalance, ...restBalanceQueryData } = useQuery({
        queryKey: ['tokenBalance', chainId, tokenAddress, account],
        queryFn: async () => {
            if (!tokenAddress) throw new Error('address is required');

            // if chainId is for evm chain
            if (EVM_CHAINS.find((c) => c === chainId)) {
                const balance = await getBalance(config, {
                    chainId: Number(chainId),
                    address: account as `0x${string}`,
                    token: !isTokenETH(tokenAddress) ? (tokenAddress as `0x${string}`) : undefined,
                });
                return balance;
            }
        },
        refetchInterval: 120_000,
        refetchOnReconnect: true,
    });

    return {
        tokenData: tokenData,
        tokenBalance: tokenBalance,
        isTokenDataLoading: restTokenQueryData.isLoading,
        isTokenBalanceLoading: restBalanceQueryData.isLoading,
        tokenDataError: restTokenQueryData.isError,
        tokenBalanceError: restBalanceQueryData.isError,
    };
};

export default useTokenData;
