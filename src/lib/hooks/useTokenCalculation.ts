import { useCallback } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { usePrices } from './usePrices';
import { Token } from '../types/token';


interface TokenAmountPriceParams {
    value: string;
    token: Token | undefined;
}

interface InputAmountParams {
    value: string;
    token: Token | undefined;
}

const useTokenCalculations = () => {
    const { data: pricelist, isLoading: pricelistIsLoading, error: pricelistError } = usePrices();

    const getTokenAmountInUSD = useCallback(
        ({ value, token }: TokenAmountPriceParams) => {
            let amountInUSDBigInt: bigint = BigInt(0);

            if (token && pricelist) {
                const amountWithDecimals = parseUnits(value, token.decimals);
                const currencyPriceInUSD = token?.symbol ? pricelist[token.symbol] ?? pricelist[token.symbol.startsWith("W") ? token.symbol.slice(1) : ""] : undefined;
                if (!currencyPriceInUSD) {
                    console.error('Invalid input or token data for calculation.');
                    return BigInt(0);
                }
                const tokenDecimal = token.decimals ? token.decimals : 0;
                const priceUSDWithDecimals = parseUnits(currencyPriceInUSD?.toFixed(6) ?? '1', 6);
                amountInUSDBigInt = (amountWithDecimals * priceUSDWithDecimals) / BigInt(10 ** tokenDecimal);
            }

            return amountInUSDBigInt;
        },
        [pricelist]
    );

    const getTokenAmount = useCallback(
        ({ value, token }: InputAmountParams) => {
            let inputTokenAmountBigInt = BigInt(0);

            if (token && pricelist) {
                const currencyPriceInUSD = token.symbol ? pricelist[token.symbol] ?? pricelist[token.symbol.startsWith("W") ? token.symbol.slice(1) : ""] : undefined;
                if (!currencyPriceInUSD) {
                    console.error('Invalid input or token data for calculation.');
                    return BigInt(0);
                }
                const tokenDecimal = token.decimals ? token.decimals : 0;
                const exactUSDWithDecimals = parseUnits(value, 6);
                const priceUSDWithDecimals = parseUnits(currencyPriceInUSD.toFixed(6) ?? '1', 6);

                if (currencyPriceInUSD !== 0 || tokenDecimal !== 0 || pricelist) {
                    const tempResult = exactUSDWithDecimals * BigInt(10 ** tokenDecimal);
                    inputTokenAmountBigInt = tempResult / priceUSDWithDecimals;
                } else {
                    console.error('Invalid input or token data for calculation.');
                }
            }

            return inputTokenAmountBigInt;
        },
        [pricelist]
    );

    return { getTokenAmountInUSD, getTokenAmount, pricelistError, pricelistIsLoading };
};

export default useTokenCalculations;