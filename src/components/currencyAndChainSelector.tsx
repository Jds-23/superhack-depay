import { Label } from '@/components/ui/label';

import { ChainIds } from '@/constants/chains';
import { MAINNET_CHAIN_IDS, MAINNET_SUPPORTED_CHAIN_IDS, TESTNET_CHAIN_IDS } from '@/constants/chains/list';
import { Token } from '@/constants/tokens';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import NetworkSelector from './NetworkSelector';
import { TokenSelector } from './TokenSelector';
import { useWalletContext } from '@/context/WalletContext';

const getChains = (testnet: boolean, filters?: ChainIds[]) => {
    if (testnet) {
        return Object.values(TESTNET_CHAIN_IDS)
            .filter((chainId) => (filters ? filters.includes(chainId) : true))
            .sort((c1, c2) => (c1[0] < c2[0] ? -1 : 1));
    }
    return Object.values(MAINNET_SUPPORTED_CHAIN_IDS)
        .filter((chainId) => (filters ? filters.includes(chainId) : true))
        .sort((c1, c2) => (c1[0] < c2[0] ? -1 : 1));
};

const CurrencyAndChainSelector = ({
    sourceChainId,
    setSourceChainId,
    sourceToken,
    setSourceToken,
    testnet,
    onlyStablesAndNative = false,
    filterChains,
    networkLabel = 'Select Network',
    tokenLabel = 'Select Token',
}: {
    sourceChainId: ChainIds;
    setSourceChainId: (c: ChainIds) => void;
    sourceToken: Token | undefined;
    setSourceToken: (token: Token) => void;
    testnet: boolean;
    onlyStablesAndNative?: boolean;
    filterChains?: ChainIds[];
    networkLabel?: string;
    tokenLabel?: string;
}) => {
    const { currentChainId } = useWalletContext();

    const allowedChains = useMemo(() => {
        return getChains(testnet, filterChains);
    }, [testnet, filterChains]);

    useEffect(() => {
        if (currentChainId && allowedChains.includes(currentChainId as ChainIds)) {
            setSourceChainId(currentChainId as ChainIds);
        }
    }, [currentChainId, allowedChains, setSourceChainId]);

    return (
        <div className='grid gap-x-4 gap-y-1.5 grid-cols-2'>
            <div className='order-2 mb-2.5 w-full xs:order-3 xs:mb-0'>
                <Label
                    className='order-1 font-normal'
                    htmlFor=''
                >
                    {/* Stake from */}
                    {/* {networkLabel} */}
                    <p className="text-xs">Select <span className="text-text3 ">Network</span></p>
                </Label>
                <NetworkSelector
                    currentChainId={sourceChainId}
                    setChain={setSourceChainId}
                    chains={allowedChains}
                />
            </div>

            <div className='order-4 w-full'>
                <Label
                    className='order-3 font-normal xs:order-2'
                    htmlFor=''
                >
                    {/* Stake on */}
                    <p className="text-xs">Select <span className="text-text3 ">Asset</span></p>
                    {/* {tokenLabel} */}
                </Label>
                <TokenSelector
                    setSourceToken={setSourceToken}
                    sourceChainId={sourceChainId}
                    sourceToken={sourceToken}
                    onlyStablesAndNative={onlyStablesAndNative}
                />
            </div>
        </div>
    );
};

export default CurrencyAndChainSelector;
