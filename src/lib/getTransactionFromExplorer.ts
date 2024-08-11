import { gqlFetcher } from './utils';
import { NitroTransactionReceipt } from './types/nitro';

export const getTransactionFromExplorer = async (hash: string): Promise<{ findNitroTransactionByFilter: NitroTransactionReceipt }> => {
    const txnQuery = `query($hash:String!) {
    findNitroTransactionByFilter(hash: $hash){
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
    const txn = await gqlFetcher(VOYAGER_EXPLORER_API_HOST, txnQuery, { hash });
    return txn;
};

const VOYAGER_EXPLORER_API_HOST = "https://api.pro-nitro-explorer-public.routernitro.com/graphql";
