import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { Token } from '../types/token';
import useTokenData from './useTokenData';
import { ChainIds } from '@/constants/chains';
import { getBalance } from 'viem/actions';
import { isTokenETH } from '../utils';
import { TPaymentStatus } from '@/components/pay/status/dialog';
import { useQuery } from '@tanstack/react-query';
import { TransactionStatus } from './useWatchCrossTransaction';
import { useWalletContext } from '@/context/WalletContext';

interface SendTransactionParams {
    to?: string;
    amount: string;
    token?: Token;
    enabled: boolean;
}

export const useSendToken = ({
    to,
    amount,
    token,
    enabled = true,
}: SendTransactionParams) => {
    const {
        currentAccount,
        currentChainId,
        switchChain,
    } = useWalletContext()
    const address = currentAccount?.address as `0x${string}` | undefined;
    const { data: walletClient } = useWalletClient();
    const srcClient = usePublicClient({ chainId: parseInt(token?.chainId ?? "0") });
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [status, setStatus] = useState<TPaymentStatus | null>(null);

    const reset = useCallback(() => {
        setTxHash(null);
        setError(null);
    }, []);

    // const transactionStatus = useMemo<TPaymentStatus | null>(() => {
    //     if (!txHash) {
    //         return null;
    //     }
    //     return 'success'
    // }, [txHash])

    const { data: srcTxData, error: srcError } = useQuery({
        queryKey: ['srcTransaction', txHash, token?.chainId],
        queryFn: async () => {
            if (!txHash) throw new Error('txHash is required');
            if (!token) throw new Error('token is required');
            if (!token.chainId) throw new Error('chainId is required');
            if (!srcClient) {
                throw new Error('Source chain client not available');
            };
            try {
                return await srcClient
                    .getTransactionReceipt({
                        hash: txHash as `0x${string}`,
                    })
                    .then((tx) => {
                        setStatus({
                            status: "success",
                            text: "Sent tokens successfully",
                        });
                        return tx;
                    });
            } catch (error) {
                return await srcClient.waitForTransactionReceipt({
                    hash: txHash as `0x${string}`,
                    onReplaced: (tx) => {
                        console.debug('Source transaction replaced', tx);
                        setTxHash?.(tx.replacedTransaction.blockHash);
                    },
                })
                    .then((tx) => {
                        setStatus({
                            status: "success",
                            text: "Sent tokens successfully",
                        });
                        return tx;
                    })
                    .catch((error) => {
                        setStatus({
                            status: "error",
                            text: "Failed to send tokens",
                        });
                        return error;
                    });
            }
        },
        enabled: enabled !== false && !!txHash,
        staleTime: Infinity, // Never refetch
    });

    const {
        tokenBalance
    } = useTokenData({
        chainId: (token?.chainId ?? "10") as ChainIds,
        tokenAddress: token?.address ?? "",
        account: address ?? ""
    })

    useEffect(() => {
        if (!token) {
            setError('Select a token');
            return;
        }
        if (!to) {
            setError('Waiting for recipient address');
            return;
        }
        if (BigInt(amount) === BigInt(0)) {
            setError('Waiting for rates');
            return;
        }
        if (BigInt(amount) > (tokenBalance?.value ?? BigInt(0))) {
            setError('Insufficient balance');
            return;
        }
        if (!walletClient || !address) {
            setError('Connect wallet');
            return;
        }
        setError(null);
    }, [amount, tokenBalance, token, to, walletClient, address, currentChainId]);

    const sendToken = useCallback(async () => {
        if (!token) {
            return;
        }
        if (!to) {
            return;
        }
        if (BigInt(amount) === BigInt(0)) {
            return;
        }
        if (BigInt(amount) > (tokenBalance?.value ?? BigInt(0))) {
            return;
        }
        if (!walletClient) {
            return;
        }
        if (!address) {
            return;
        }
        if (token.chainId !== currentChainId) {
            switchChain(token.chainId as ChainIds);
            return;
        }
        setStatus({
            status: "waiting",
            text: "Confirm transaction in wallet",
        });
        if (isTokenETH(token.address)) {
            const hash = await walletClient?.sendTransaction({
                account: address,
                to: to as `0x${string}`,
                value: BigInt(amount),
                data: "0x"
            })
            setTxHash(hash)
            setStatus({
                status: "pending",
                text: "Sending tokens",
            });
            return hash
        } else {
            const calldata = encodeFunctionData({
                abi: [{ "type": "function", "name": "transfer", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" }],
                functionName: "transfer",
                args: [
                    to as `0x${string}`,
                    BigInt(amount)
                ]
            })
            const hash = await walletClient?.sendTransaction({
                account: address,
                to: token?.address as `0x${string}`,
                value: BigInt(0),
                data: calldata
            })
            setTxHash(hash)
            setStatus({
                status: "pending",
                text: "Sending tokens",
            });
            return hash
        }
    }, [amount, tokenBalance, token, to, setTxHash, walletClient, address])


    return { sendToken, error, status, txHash, reset };
};