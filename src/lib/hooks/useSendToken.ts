import { use, useCallback, useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { Token } from '../types/token';
import useTokenData from './useTokenData';
import { ChainIds } from '@/constants/chains';
import { getBalance } from 'viem/actions';
import { isTokenETH } from '../utils';

interface SendTransactionParams {
    to?: string;
    amount: string;
    token?: Token;
}

export const useSendToken = ({
    to,
    amount,
    token
}: SendTransactionParams) => {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
    }, [amount, tokenBalance, token, to, walletClient, address]);

    const sendToken = useCallback(() => {
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
        if (!walletClient || !address) {
            return;
        }

        if (isTokenETH(token.address)) {
            return walletClient?.sendTransaction({
                account: address,
                to: to as `0x${string}`,
                value: BigInt(amount)
            })
        } else {
            const calldata = encodeFunctionData({
                abi: [{ "type": "function", "name": "transfer", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" }],
                functionName: "transfer",
                args: [
                    to as `0x${string}`,
                    BigInt(amount)
                ]
            })
            return walletClient?.sendTransaction({
                account: address,
                to: token?.address as `0x${string}`,
                value: BigInt(0),
                data: calldata
            })
        }
    }, [amount, tokenBalance, token, to, walletClient, address])


    return { sendToken, isLoading, error };
};