type Asset = {
    decimals: number;
    symbol: string;
    name: string;
    chainId: string;
    address: string;
    resourceID: string;
    isMintable: boolean;
    isWrappedAsset: boolean;
};

type BridgeFee = {
    amount: string;
    decimals: number;
    symbol: string;
};

type SourceDestination = {
    chainId: string;
    asset: Asset;
    stableReserveAsset: Asset;
    tokenAmount: string;
    stableReserveAmount: string;
    path: any[]; // Depending on the structure of path
    flags: any[]; // Depending on the structure of flags
    priceImpact: string;
    tokenPath: string;
    dataTx: any[]; // Depending on the structure of dataTx
};

type Transaction = {
    from: string;
    to: string;
    data: string;
    value: string;
    gasPrice: string;
    gasLimit: number;
};

type PeQuote = {
    flowType: string;
    isTransfer: boolean;
    isWrappedToken: boolean;
    allowanceTo: string;
    bridgeFee: BridgeFee;
    fromTokenAddress: string;
    toTokenAddress: string;
    source: SourceDestination;
    destination: SourceDestination;
    partnerId: number;
    fuelTransfer: null | any; // Depending on the structure of fuelTransfer
    slippageTolerance: string;
    estimatedTime: number;
    senderAddress: string;
    receiverAddress: string;
    txn: Transaction;
    depositMeta: PeDepositMeta | undefined;
};

type PeQuoteQueryParams = {
    fromTokenAddress: string | undefined;
    toTokenAddress: string | undefined;
    toAddress: string | undefined;
    amount: string | undefined;
    fromTokenChainId: string | number | undefined;
    toTokenChainId: string | number | undefined;
    enabled: boolean;
};

type PeTransactionParams = {
    fromTokenAddress: string | undefined;
    amount: string | undefined;
    fromTokenChainId: number | undefined;
};

type PeDepositMeta = {
    depositAddress: string;
}