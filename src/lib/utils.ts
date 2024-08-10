import { CHAIN_IDS, ChainIds, Chains, NetworkType, TRUST_WALLET_EXCEPTIONS } from '@/constants/chains';
import { CHAINS_DATA } from '@/constants/chains/list';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getAddress } from 'viem';
import { NitroTransactionReceipt } from '@/lib/types/nitro';
import numeral from 'numeral';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalized = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export const isTokenETH = (address: string) =>
  address && address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const areTokensEqual = (tokenA: string, tokenB: string) => tokenA.toLowerCase() === tokenB.toLowerCase();

export const shortenAddress = (address: string | undefined, chars = 4) =>
  address ? `${address.slice(0, chars + 2)}...${address.slice(-chars)}` : '';

export const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const fetchNitroGql = async (environment: string, query: string, variables: any) => {
  let url = '';
  if (environment === 'mainnet') {
    url = 'https://api.pro-nitro-explorer-public.routernitro.com/graphql';
  } else {
    url = 'https://api.iswap-explorer-testnet.routerprotocol.com/graphql';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  return json.data;
};

export const getExplorerLink = (hash: string, chainId: ChainIds) => {
  const explorerUrl = CHAINS_DATA[chainId]?.blockExplorers?.default.url;
  return `${explorerUrl}/tx/${hash}`;
};

export const NITRO_ENV = process.env.NEXT_PUBLIC_NITRO_ENV;

export const getNitroExplorerLink = (hash?: string) => {
  if (NITRO_ENV === 'mainnet') {
    const base = 'https://explorer.routernitro.com/';

    if (!hash) return base;
    return `${base}/tx/${hash}`;
  }

  const base = 'https://explorer-testnet.routernitro.com/';

  if (!hash) return base;
  return `${base}/tx/${hash}`;
};

const lineaTokenLogoURIs: {
  [address: string]: string;
} = {
  '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f':
    'https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg',
  '0x7d43aabc515c356145049227cee54b608342c0ad': 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
  '0xf5C6825015280CdfD0b56903F9F8B5A2233476F5': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  '0x5471ea8f739dd37E9B81Be9c5c77754D8AA953E4': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
  '0x265B25e22bcd7f10a5bD6E6410F10537Cc7567e8': 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  '0x997BF0ebF2a2a2e8189493cedFd19bCDb077c0d0': 'https://noobysswap.io/assets/images/nbs_logo.png',
  '0x9201f3b9DfAB7C13Cd659ac5695D12D605B5F1e6': 'https://echodex.io/images/coins/ecp.png',
  '0x0963a1aBAF36Ca88C21032b82e479353126A1C4b':
    'https://raw.githubusercontent.com/LeetSwap/tokenlist/master/logos/leet.png',
  '0x9dd6ea6f9d1fba5ed640651f06802e32ff455221': 'https://i.ibb.co/NNzQ46L/Lin.png',
  '0x6C6470898882b65E0275723D883A0D877aADe43f': 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=025',
  '0x66627F389ae46D881773B7131139b2411980E09E': 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=025',
  '0x60D01EC2D5E98Ac51C8B4cF84DfCCE98D527c747':
    'https://assets.coingecko.com/coins/images/21791/small/izumi-logo-symbol.png?1640053924',
  '0x0B1A02A7309dFbfAD1Cd4adC096582C87e8A3Ac1': 'https://i.ibb.co/QJjY1Dd/Circle-logo-black.png',
  '0x7f5373AE26c3E8FfC4c77b7255DF7eC1A9aF52a6': 'https://i.ibb.co/GQKtJb3/uusdt-D-3x.png',
  '0xEB466342C4d449BC9f53A865D5Cb90586f405215': 'https://i.ibb.co/DRYxg4N/uausdc-L-3x.png',
  '0x176211869cA2b568f2A7D4EE941E073a821EE1ff':
    'https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png',
  '0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4':
    'https://thumbs.dreamstime.com/b/wrapped-bitcoin-wbtc-token-symbol-cryptocurrency-logo-coin-icon-isolated-white-background-wrapped-bitcoin-wbtc-token-symbol-219820880.jpg',
  '0xA219439258ca9da29E9Cc4cE5596924745e12B93': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  '0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5': 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
  '0x2140Ea50bc3B6Ac3971F9e9Ea93A1442665670e4': 'https://i.ibb.co/zmGrR16/500-500-px.png',
  '0x13a7F090D46C74acBA98c51786a5c46eD9A474F0': 'https://i.ibb.co/12Fy3g1/Ava-Scamfari.png',
  '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376': 'https://i.ibb.co/khhLbd7/Group-27795.png',
  '0x2f0b4300074afc01726262d4cc9c1d2619d7297a': 'https://i.ibb.co/w0m0KsN/image-2023-11-15-16-59-48.jpg',
  '0xcc22F6AA610D1b2a0e89EF228079cB3e1831b1D1': 'https://linea.velocore.xyz/assets/LVC-8ac4b844.svg',
};

export const getTokenLogoURI = (address: string, chain: Chains) => {
  if (!address) return '';
  if (isTokenETH(address))
    if (TRUST_WALLET_EXCEPTIONS[chain])
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${TRUST_WALLET_EXCEPTIONS[chain]}/info/logo.png`;
    else return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/info/logo.png`;
  if (chain === 'linea') return lineaTokenLogoURIs[address];

  const logoUri = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains';

  if (TRUST_WALLET_EXCEPTIONS[chain]) {
    return `${logoUri}/${TRUST_WALLET_EXCEPTIONS[chain]}/assets/${getAddress(address)}/logo.png`;
  }

  return `${logoUri}/${chain}/assets/${getAddress(address)}/logo.png`;
};

export const getChainType = (chainId: string): NetworkType => {
  switch (chainId) {
    case CHAIN_IDS.avalanche:
    case CHAIN_IDS.binance:
    case CHAIN_IDS.arbitrum:
    case CHAIN_IDS.optimism:
    case CHAIN_IDS.polygon:
    case CHAIN_IDS.zksync:
    case CHAIN_IDS.polygon_zkevm:
    case CHAIN_IDS.manta:
    case CHAIN_IDS.scroll:
    case CHAIN_IDS.mantle:
    case CHAIN_IDS.base:
    case CHAIN_IDS.linea:
      return NetworkType.EVM;
    case CHAIN_IDS.tron:
      return NetworkType.TRON;

    default:
      throw new Error(`Chain ${chainId} is not supported`);
  }
};

export const getTransactionFromNitroExplorer = async (
  hash: string,
  environment: 'mainnet' | 'testnet',
): Promise<{ findNitroTransactionByFilter: NitroTransactionReceipt; error: any }> => {
  const testnetTxQuery = `query($hash:String!) {
  transaction(hash: $hash){
    dest_timestamp
    src_timestamp
    src_tx_hash
    dest_tx_hash
    status
    dest_address
    dest_amount
    dest_symbol
    fee_amount
    fee_address
    fee_symbol
    recipient_address
    deposit_id
    src_amount
    dest_amount
    src_stable_address
}}`;
  const mainnetTxQuery = `query($hash:String!) {
  findNitroTransactionByFilter(hash: $hash) {
    dest_timestamp
    src_timestamp
    src_tx_hash
    dest_tx_hash
    status
    dest_address
    dest_amount
    dest_symbol
    fee_amount
    fee_address
    fee_symbol
    recipient_address
    deposit_id
    src_amount
    dest_amount
    src_stable_address
  }
}`;
  const txnQuery = environment === 'mainnet' ? mainnetTxQuery : testnetTxQuery;
  const txn = await fetchNitroGql(environment, txnQuery, { hash });
  return txn;
};



export const formatNumber = (number: number | string) => {
  number = typeof number === 'string' ? parseFloat(number) : number;

  if (number >= 1) {
    if (number > 99999) {
      return numeral(Math.ceil(number)).format('0.[0]a');
    }
    if (number > 9999) {
      return numeral(Math.ceil(number * 100) / 100).format('0.[00]a');
    }
    return numeral(Math.ceil(number * 100) / 100).format('0.[00]');
  }
  if (number < 0.001) {
    return numeral(Math.ceil(number * 10000) / 10000).format('0.0[0000]');
  }
  if (number < 1) {
    return numeral(Math.ceil(number * 10000) / 10000).format('0.00[00]');
  }

  return numeral(Math.ceil(number * 100) / 100).format('0.[00]');
};