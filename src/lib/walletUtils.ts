import { WALLET_MAP } from '@/constants/wallets';
import { WALLET_ID, Wallet, WalletId } from '@/lib/types/WalletContextTypes';
import { Connector } from 'wagmi';

export const getEvmConnectorId = async (connector: Connector) => {
    if (!connector.getProvider) return undefined;

    const provider: any = await connector.getProvider();

    if (provider.isFrame) {
        return 'sh.frame';
    }
    if (provider.isSafe) {
        return 'safe';
    }
    if (provider.isTrust) {
        return 'trust';
    }
    if (provider.isRabby) {
        return 'io.rabby';
    }
    if (provider.isMetamask) {
        return 'io.metamask';
    }

    return undefined;
};

export const getWallet = (id: string) => {
    if (id in WALLET_ID) return WALLET_MAP[id as WalletId];

    return undefined;
};
