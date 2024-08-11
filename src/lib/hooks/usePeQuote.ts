import { useQuery } from "@tanstack/react-query";

const usePeQuote = (quoteQueryParams: PeQuoteQueryParams) => {
    const { fromTokenAddress, amount, fromTokenChainId, enabled } = quoteQueryParams;
    const toTokenAddress = quoteQueryParams.toTokenAddress ?? TARGET_TOKEN_ADDRESS;
    const toAddress = quoteQueryParams.toAddress ?? TARGET_RECEIVER_ADDRESS;
    const toTokenChainId = quoteQueryParams.toTokenChainId ?? TARGET_CHAIN_ID;
    const { data, isLoading, isError, error } = useQuery<PeQuote>({
        queryKey: [
            'peQuote',
            fromTokenAddress,
            amount,
            fromTokenChainId,
            PARTNER_ID,
            toTokenAddress,
            toTokenChainId,
        ],
        queryFn: async () => {
            const queryString = `?fromTokenAddress=${fromTokenAddress}&amount=${amount}&fromTokenChainId=${fromTokenChainId}&partnerId=${PARTNER_ID}&toTokenAddress=${TARGET_TOKEN_ADDRESS}&toTokenChainId=${TARGET_CHAIN_ID}&slippageTolerance=1`;
            const res = await fetch(`https://api-beta.pathfinder.routerprotocol.com/api/v2/quote${queryString}`);
            if (!res.ok) {
                throw new Error('Failed to fetch quote');
            }
            return res.json();
        },
        enabled
    });

    return { data, isLoading, isError, error };
};

const TARGET_CHAIN_ID = 42161;
const TARGET_TOKEN_ADDRESS = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
const TARGET_RECEIVER_ADDRESS = '0xA40DA4D0272B2dc571bAf9122165Dd29989Ae81C';
// const TARGET_CHAIN_ID = 728126428;
// const TARGET_TOKEN_ADDRESS = '0xA614F803B6FD780986A42C78EC9C7F77E6DED13C';


// const TARGET_CHAIN_ID = 137;
// const TARGET_TOKEN_ADDRESS = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';
// const TARGET_RECEIVER_ADDRESS = '0xD253eDAF1B53a2E0e5E1B8021ba4937D21806dd3';

// const TARGET_RECEIVER_ADDRESS = '0x291ff2d8bebee4302f006667d5af2bb7b8675e49';
const PARTNER_ID = 1;

export default usePeQuote;

const usePeTransaction = (quoteData: PeQuote | undefined, enabled: boolean, toAddress: string, senderAddress: string) => {
    // console.log("sender", address);
    // console.log("yes inside transaction");
    const receiverAddress = toAddress;
    const { data, isLoading, isError, error } = useQuery<PeQuote>({
        queryKey: ['peQuotePost', quoteData],
        queryFn: async () => {
            if (!quoteData) {
                throw new Error('Quote data is empty');
            }
            const res = await fetch('https://btc-testnet.poap-nft.routernitro.com/internal/transaction', {
                // const res = await fetch(`${API_URL}transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...quoteData, senderAddress, receiverAddress }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch quote');
            }

            return res.json();
        },
        enabled
    });

    return { data, isLoading, isError, error };
};

export { usePeTransaction };

export const usePeDeposit = (quoteQueryParams: PeQuoteQueryParams, senderAddress: string) => {
    const { fromTokenAddress, amount, fromTokenChainId, enabled, toTokenAddress, toAddress, toTokenChainId } = quoteQueryParams;

    const { data, isLoading, isError, error } = useQuery<PeQuote>({
        queryKey: ['peDepositPost', quoteQueryParams],
        queryFn: async () => {

            if (!fromTokenAddress || !amount || !fromTokenChainId) {
                throw new Error('Invalid quote data');
            }
            if (!senderAddress || !toAddress) {
                throw new Error('Invalid sender or receiver address');
            }
            if (!toTokenAddress || !toTokenChainId) {
                throw new Error('Invalid destination token address or chain id');
            }

            const queryString = `?fromTokenAddress=${fromTokenAddress}&amount=${amount}&fromTokenChainId=${fromTokenChainId}&partnerId=${PARTNER_ID}&toTokenAddress=${TARGET_TOKEN_ADDRESS}&toTokenChainId=${TARGET_CHAIN_ID}&slippageTolerance=1`;
            const quoteRes = await fetch(`https://api-beta.pathfinder.routerprotocol.com/api/v2/quote${queryString}`);
            if (!quoteRes.ok) {
                throw new Error('Failed to fetch quote');
            }
            const quoteData = (await quoteRes.json()) as PeQuote;
            if (!quoteData) {
                throw new Error('Failed to fetch quote');
            }
            const res = await fetch('https://btc-testnet.poap-nft.routernitro.com/internal/transaction', {
                // const res = await fetch(`${API_URL}transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...quoteData, senderAddress, receiverAddress: toAddress }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch quote');
            }

            return res.json();
        },
        enabled
    });

    return { data, isLoading, isError, error };
}

export const usePeTransactionHash = (da: string | undefined, enabled: boolean) => {
    // const { address } = useAccount();
    // console.log("sender", address);
    // console.log("yes inside transaction");
    const { data, isLoading, isError, error } = useQuery<{
        txnHash: string | null;
    }>({
        enabled,
        refetchInterval: 1000,
        queryKey: ['PeTransactionHash', da],
        queryFn: async () => {
            if (!da) {
                throw new Error('Da is empty');
            }
            const res = await fetch(`https://btc-testnet.poap-nft.routernitro.com/internal/txnHash?da=${da}`);
            // const res = await fetch(`${API_URL}txnHash?da=${da}`);

            if (!res.ok) {
                throw new Error('Failed to fetch txn hash');
            }

            return res.json();
        },
    });

    return { data, isLoading, isError, error };
};