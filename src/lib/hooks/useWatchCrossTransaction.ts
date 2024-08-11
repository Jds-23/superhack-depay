'use client';
// import { getTransactionFromExplorer } from '@/lib/getTransactionFromExplorer';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Chain, ReplacementReturnType, TransactionReceipt } from 'viem';
import { usePublicClient, useWaitForTransactionReceipt } from 'wagmi';
import validateCrosschainTransaction from '@/lib/validateSourceCrosschainTransaction';
import { NitroTransactionReceipt } from '../types/nitro';
import { getTransactionFromExplorer } from '../getTransactionFromExplorer';

export const enum TransactionStatus {
    NONE,
    SOURCE_PENDING,
    SOURCE_FAILED,
    SOURCE_CONFIRMED,
    CROSSCHAIN_SRC_PENDING,
    CROSSCHAIN_SRC_FAILED,
    CROSSCHAIN_INDEXED,
    CROSSCHAIN_DEST_FAILED,
    CROSSCHAIN_DEST_CONFIRMED,
    DEST_FETCH_FAILED,
    DEST_CONFIRMED,
}

interface UseWatchCrosschainTransactionProps {
    destChainId: number;
    srcChainId: number;
    sourceHash: string | undefined;
    onSourcePending: (tx: string) => void;
    onSourceConfirm?: (tx: string) => any;
    onSourceFailed?: (tx: TransactionReceipt | undefined) => any;
    onSourceReplaced?: (tx: ReplacementReturnType<Chain | undefined>) => any;
    onCrosschainIndexed?: (tx: NitroTransactionReceipt) => any;
    onCrosschainDestConfirmed?: (tx: string) => any;
    onCrosschainFailed?: (tx: NitroTransactionReceipt | undefined) => any;
    onDestConfirm?: (tx: TransactionReceipt) => any;
    onDestFailed?: (tx: TransactionReceipt | undefined) => any;
    enabled?: boolean;
}

interface WatchCrosschainTransaction {
    status: TransactionStatus;
    sourceTx: TransactionReceipt | undefined;
    crosschainTx: NitroTransactionReceipt | undefined;
    destTx: TransactionReceipt | undefined;
    sourceTxError: any;
    crosschainTxError: any;
    destTxError: any;
}

const useWatchCrosschainTransaction = ({
    srcChainId,
    destChainId,
    sourceHash,
    onSourcePending,
    onSourceConfirm,
    onSourceFailed,
    onSourceReplaced,
    onCrosschainIndexed,
    onCrosschainDestConfirmed,
    onCrosschainFailed,
    onDestConfirm,
    enabled,
    onDestFailed,
}: UseWatchCrosschainTransactionProps): WatchCrosschainTransaction => {
    const srcClient = usePublicClient({ chainId: srcChainId });
    const destClient = usePublicClient({ chainId: destChainId });
    // const {}=useWaitForTransactionReceipt({

    // });

    const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.NONE);
    const { data: srcTxData, error: srcError } = useQuery({
        queryKey: ['srcTransaction', sourceHash, srcChainId],
        queryFn: async () => {
            if (sourceHash) {
                onSourcePending(sourceHash);
            }
            setStatus(TransactionStatus.SOURCE_PENDING);
            if (!srcClient) {
                throw new Error('Source chain client not available');
            };
            try {
                return await srcClient
                    .getTransactionReceipt({
                        hash: sourceHash as `0x${string}`,
                    })
                    .then((tx) => {
                        if (validateCrosschainTransaction(tx, srcChainId, destChainId) === false) {
                            setStatus(TransactionStatus.SOURCE_FAILED);
                            onSourceFailed?.(tx);
                            return tx;
                        }
                        setStatus(TransactionStatus.SOURCE_CONFIRMED);
                        onSourceConfirm?.(tx.transactionHash);
                        return tx;
                    });
            } catch (e: any) {
                return await srcClient.waitForTransactionReceipt({
                    hash: sourceHash as `0x${string}`,
                    onReplaced: (tx) => {
                        console.debug('Source transaction replaced', tx);
                        onSourceReplaced?.(tx);
                    },
                })
                    .then((tx) => {
                        if (validateCrosschainTransaction(tx, srcChainId, destChainId) === false) {
                            setStatus(TransactionStatus.SOURCE_FAILED);
                            onSourceFailed?.(tx);
                            return tx;
                        }

                        setStatus(TransactionStatus.SOURCE_CONFIRMED);
                        onSourceConfirm?.(tx.transactionHash);
                        return tx;
                    })
                    .catch((error) => {
                        setStatus(TransactionStatus.SOURCE_FAILED);
                        onSourceFailed?.(error);
                        throw error;
                    });
            }
        },
        enabled: enabled !== false && !!sourceHash,
        staleTime: Infinity, // Never refetch
    });

    const { data: crosschainIndexedTxData, error: crosschainError } = useQuery({
        queryKey: ['crosschainTransactionIndexed', srcTxData?.transactionHash],
        queryFn: async ({ signal }) => {
            if (!srcTxData) {
                throw new Error('Source transaction not available');
            };

            setStatus(TransactionStatus.CROSSCHAIN_SRC_PENDING);

            return new Promise<NitroTransactionReceipt>((resolve, reject) => {
                const checkTx = async () => {
                    const tx = await getTransactionFromExplorer(srcTxData.transactionHash);
                    if (tx?.findNitroTransactionByFilter?.src_tx_hash !== null) {
                        clearInterval(interval);

                        onCrosschainIndexed?.(tx.findNitroTransactionByFilter);

                        resolve(tx.findNitroTransactionByFilter);
                    }
                };

                const interval = setInterval(checkTx, 1000);

                // clear intervals
                // setTimeout(() => {
                //   clearInterval(interval);
                //   reject('Crosschain transaction not indexed');
                // }, 300_000);

                signal?.addEventListener('abort', () => {
                    clearInterval(interval);
                    console.log('Aborted crosschain indexed check');

                    return {} as NitroTransactionReceipt;
                });
            })
                .then((tx) => {
                    console.log('Crosschain transaction indexed', tx);
                    setStatus(TransactionStatus.CROSSCHAIN_INDEXED);
                    onCrosschainIndexed?.(tx);
                    return tx;
                })
                .catch((error) => {
                    setStatus(TransactionStatus.CROSSCHAIN_SRC_FAILED);
                    onCrosschainFailed?.(error);
                    throw error;
                });
        },
        enabled: enabled !== false && !!srcTxData && srcChainId !== destChainId,
        staleTime: Infinity, // Never refetch
    });

    const { data: crosschainDestTxData, error: crosschainDestError } = useQuery({
        queryKey: ['crosschainTransactionDest', crosschainIndexedTxData?.src_tx_hash, destChainId],
        queryFn: async ({ signal }) => {
            if (!crosschainIndexedTxData?.src_tx_hash) return;

            return new Promise<NitroTransactionReceipt>((resolve, reject) => {
                const checkDesttxn = async () => {
                    const tx = await getTransactionFromExplorer(crosschainIndexedTxData.src_tx_hash);
                    if (tx?.findNitroTransactionByFilter) {
                        if (tx.findNitroTransactionByFilter?.dest_tx_hash) {
                            clearInterval(interval);

                            onCrosschainDestConfirmed?.(tx.findNitroTransactionByFilter.dest_tx_hash);

                            resolve(tx.findNitroTransactionByFilter);
                        }
                        if (tx.findNitroTransactionByFilter?.status === 'failed') {
                            clearInterval(interval);

                            reject('Crosschain transaction failed');
                        }
                    }
                };

                const interval = setInterval(checkDesttxn, 2500);

                // clear intervals
                // setTimeout(() => {
                //   clearInterval(interval);
                //   reject('Timeout waiting for crosschain destination transaction');
                // }, 300_000);
                signal?.addEventListener('abort', () => {
                    clearInterval(interval);
                    console.log('Aborted crosschain destination check');

                    return {} as NitroTransactionReceipt;
                });
            })
                .then((tx) => {
                    console.log('Crosschain destination transaction confirmed', tx);
                    setStatus(TransactionStatus.CROSSCHAIN_DEST_CONFIRMED);
                    onCrosschainDestConfirmed?.(tx.dest_tx_hash);
                    return tx;
                })
                .catch((error) => {
                    setStatus(TransactionStatus.CROSSCHAIN_DEST_FAILED);
                    onCrosschainFailed?.(error);
                    throw error;
                });
        },
        enabled: enabled !== false && !!crosschainIndexedTxData?.src_tx_hash,
        staleTime: Infinity, // Never refetch
    });

    const { data: destTxData, error: destError } = useQuery({
        queryKey: ['destTransaction', crosschainDestTxData?.dest_tx_hash, destChainId],
        queryFn: async () => {
            if (!crosschainDestTxData?.dest_tx_hash) throw new Error('Destination transaction not available');
            if (!destClient) throw new Error('Destination chain client not available');
            try {
                return await destClient
                    .getTransactionReceipt({
                        hash: crosschainDestTxData.dest_tx_hash as `0x${string}`,
                    })
                    .then((tx) => {
                        setStatus(TransactionStatus.DEST_CONFIRMED);
                        onDestConfirm?.(tx);
                        return tx;
                    })
                    .catch((error) => {
                        console.error('Error fetching dest transaction', error);
                        throw error;
                    });
            } catch (e) {
                return destClient.waitForTransactionReceipt({
                    hash: crosschainDestTxData.dest_tx_hash as `0x${string}`,
                    onReplaced: (tx) => {
                        console.debug('Dest transaction replaced', tx);
                    },
                })
                    .then((tx) => {
                        console.log('Destination transaction confirmed', tx);
                        setStatus(TransactionStatus.DEST_CONFIRMED);
                        onDestConfirm?.(tx);
                        return tx;
                    })
                    .catch((error) => {
                        console.error('Error waiting for dest transaction', error);
                        setStatus(TransactionStatus.DEST_FETCH_FAILED);
                        onDestFailed?.(error);
                        throw error;
                    });
            }
        },
        enabled: enabled !== false && !!crosschainDestTxData?.dest_tx_hash,
        staleTime: Infinity, // Never refetch
    });

    return {
        status: status,
        sourceTx: srcTxData,
        crosschainTx: crosschainDestTxData ? crosschainDestTxData : crosschainIndexedTxData,
        destTx: destTxData,
        sourceTxError: srcError,
        crosschainTxError: crosschainDestError ? crosschainDestError : crosschainError,
        destTxError: destError,
    };
};

export default useWatchCrosschainTransaction;
