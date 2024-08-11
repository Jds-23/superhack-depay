import { Token, TokenSchema } from '@/lib/types/token';
import { cn, formatNumber, getTokenLogoURI } from '@/lib/utils';
import React, { use, useEffect, useState } from 'react'
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { Separator } from '../ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import CurrencyAndChainSelector from '../currencyAndChainSelector';
import { ChainIds, CHAINS } from '@/constants/chains';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import CoolQRCode, { AddressQRCode } from '../coolqr';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleProgress } from './status/progress';
import Image from 'next/image';
import PaymentStatusDialog, { TPaymentStatus } from './status/dialog';
import { usePeDeposit, usePeTransactionHash } from '@/lib/hooks/usePeQuote';
import useWatchCrosschainTransaction from '@/lib/hooks/useWatchCrossTransaction';
import { onDestinationError, onSourceConfirm, onSourceError, waitingForSourceConfirmation } from './status/statuses';
import { useSendToken } from '@/lib/hooks/useSendToken';

export const paymentSchema = z.object({
    fromToken: TokenSchema,
    refundAddress: z.string(),
});

type PayComponentProps = {
    price: string;
    merchantAddress: string;
    merchantToken: Token;
}

type DialogFor = "QR" | "Processing"

const PayComponent = ({
    price,
    merchantAddress,
    merchantToken,
}: React.HTMLAttributes<HTMLDivElement> & PayComponentProps) => {
    // const paymentForm = useFormContext<z.infer<typeof paymentSchema>>();
    const paymentForm = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            fromToken: undefined,
            refundAddress: undefined,
        }
    });
    const [hashes, setHashes] = useState<string[]>([])
    const [statusArray, setStatusArray] = useState<TPaymentStatus[]>([])

    function onSubmit(values: z.infer<typeof paymentSchema>) {
        setOpen("QR")
    }
    const [chainId, seChainId] = useState<ChainIds>("137");
    const [open, setOpen] = useState<DialogFor | undefined>("Processing");
    const token = paymentForm.watch('fromToken')


    useEffect(() => {
        if (token && token.chainId !== chainId) {
            paymentForm.resetField('fromToken')
        }
    }, [chainId, token])

    const {
        data: transactionData,
        isLoading: isTransactionLoading,
        isError: isTransactionError,
        error: transactionDataError,
    } = usePeDeposit(
        {
            fromTokenAddress: paymentForm.getValues('fromToken')?.address,
            toTokenAddress: merchantToken.address,
            //    toAddress: merchantAddress,
            toAddress: "0x40d5250D1ce81fdD1F0E0FB4F471E57AA0c1FaD3",
            // amount: price, // to be converted to string
            amount: "1000000",
            enabled: !!token,
            fromTokenChainId: chainId,
            toTokenChainId: merchantToken.chainId,

        },
        paymentForm.getValues('refundAddress'),
    )

    const {
        sendToken,
        isLoading: isSendTokenLoading,
        error: sendTokenError,
    } = useSendToken({
        to: transactionData?.depositMeta?.depositAddress,
        amount: "1000000",
        token: paymentForm.getValues('fromToken')
    })

    const {
        data: transactionHashData,
        isLoading: isTransactionHashLoading,
        isError: isTransactionHashError,
        error: transactionHashDataError,
    } = usePeTransactionHash(transactionData?.depositMeta?.depositAddress, open !== "Processing");

    const {
        status,
        sourceTx,
        crosschainTx,
        destTx,
        sourceTxError: srcError,
        crosschainTxError,
        destTxError,
    } = useWatchCrosschainTransaction({
        srcChainId: parseInt(chainId),
        destChainId: parseInt(merchantToken.chainId),
        sourceHash: transactionHashData?.txnHash ?? undefined,
        onSourcePending: (hash) => {
            setHashes((prev) => [hash])
            setStatusArray(waitingForSourceConfirmation)
        },
        onSourceConfirm: (hash) => {
            setHashes((prev) => [hash])
            setStatusArray(onSourceConfirm)
        },
        onSourceFailed: (receipt) => {
            setHashes((prev) => receipt?.blockHash ? [receipt?.blockHash] : [])
            setStatusArray(onSourceError)
        },
        onSourceReplaced: (receipt) => {
            setHashes((prev) => receipt?.transactionReceipt.blockHash ? [receipt?.transactionReceipt.blockHash] : [])
            setStatusArray(waitingForSourceConfirmation)
        },
        onCrosschainIndexed: (receipt) => {
            setHashes((prev) => [receipt?.src_tx_hash, receipt?.dest_tx_hash])
            setStatusArray(onSourceConfirm)
        },
        onCrosschainDestConfirmed: (receipt) => {
        },
        onCrosschainFailed: (receipt) => {
            setStatusArray(onDestinationError)
        },
        onDestConfirm: (receipt) => {
            setHashes((prev) => [prev[0], receipt.blockHash])
            setStatusArray(onSourceConfirm)
        },
        enabled: true,
        onDestFailed: (receipt) => {
            setHashes((prev) => [prev[0], receipt?.blockHash ?? prev[1]])
            setStatusArray(onDestinationError)
        },
    });

    useEffect(() => {
        if (statusArray.length > 0 && open !== "Processing") {
            setOpen("Processing");
        }
    }, [statusArray]);




    return (
        <>
            <Dialog open={!!open} onOpenChange={() => { setOpen(undefined) }} >
                {open === "QR" && <PayViaQRModal
                    token={token}
                    chainId={chainId}
                    refundAddress={paymentForm.getValues('refundAddress')}
                    toPayAddress={transactionData?.depositMeta?.depositAddress}
                    price={price}
                />}
                {
                    open === "Processing" && <PaymentStatusDialog
                        hashes={hashes}
                        statusArray={statusArray}
                    />
                }
            </Dialog>
            <div className={cn('sm:pl-9 my-auto space-y-3')}>
                <h1 className='text-lg sm:text-2xl font-semibold'>
                    Payment method
                </h1>
                <sub className='text-sm underline text-muted-foreground'>
                    Important Note: Please pay the exact amount and in selected Chain and Asset!
                </sub>

                <InfoComponent
                    token={merchantToken}
                    chainId={chainId}
                    price={price}
                />
                <Form {...paymentForm}>
                    <form onSubmit={paymentForm.handleSubmit(onSubmit)} className="space-y-1">
                        <FormField
                            control={paymentForm.control}
                            name="fromToken"
                            render={({ field }) => (
                                <FormItem className='space-y-0'>
                                    <FormLabel>Pay With</FormLabel>
                                    <CurrencyAndChainSelector
                                        setSourceChainId={seChainId}
                                        sourceChainId={chainId}
                                        testnet={false}
                                        sourceToken={field.value}
                                        setSourceToken={(value) => field.onChange({ target: { value } })}
                                    />
                                    <FormDescription>
                                        The token you want pay with.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={paymentForm.control}
                            name="refundAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Refund Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            className='input'
                                            placeholder="0x"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        If the payment fails, the amount will be refunded to this address.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className='w-full'
                        >Pay Via QR</Button>
                        <Button type="button" onClick={() => { sendToken() }} variant={"outline"} className='w-full'>{sendTokenError ? sendTokenError : "Pay"}</Button>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default PayComponent

type InfoComponentProps = {
    token?: Token;
    chainId: ChainIds;
    price: string;
}

const InfoComponent = ({
    token,
    chainId,
    price
}: InfoComponentProps) => {
    const chainName = CHAINS[chainId]
    return (
        <div className='rounded-md  items-center justify-between flex space-x-1 border border-input bg-transparent px-3 py-2 text-lg sm:text-2xl  shadow-sm transition-colors '>
            <p className='text-primary font-extrabold mr-1'>
                ${formatNumber(price)}
            </p>
            <Separator orientation="vertical" />
            {token ? <div className='flex-grow text-base sm:text-xl'>
                Min 1214 {token?.symbol} on {chainName.toUpperCase().slice(0, 3)} within
            </div> :
                <div className='flex-grow text-xl text-muted-foreground'>
                    Select A Token
                </div>}
            <div className='rounded-full text-sm bg-primary/30 p-2'>
                3.6sec
            </div>
        </div>
    )
}

type PayViaQRModalProps = {
    token: Token;
    chainId: ChainIds;
    refundAddress: string;
    toPayAddress: string | undefined;
    price: string;
}

const PayViaQRModal = ({ token, chainId, refundAddress, price, toPayAddress }: PayViaQRModalProps) => {
    return (
        <DialogContent className="sm:max-w-[525px] rounded-xl space-y-0">
            <DialogHeader>
                <DialogTitle>Pay Via QR</DialogTitle>
                <DialogDescription>
                    Scan And Pay Via Your Wallet/CEX
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 pb-4">
                <sub className='text-sm underline text-muted-foreground'>
                    Important Note: Please pay the exact amount and in selected Chain and Asset!
                </sub>
            </div>
            {/* 0xD253eDAF1B53a2E0e5E1B8021ba4937D21806dd3 */}
            <div className="flex justify-center m-auto items-center gap-1 pt-2">
                {
                    toPayAddress &&
                    <AddressQRCode
                        address={toPayAddress}
                        imgStr={token && getTokenLogoURI(token.address, CHAINS[token.chainId as ChainIds])}
                    />
                }
            </div>
            <InfoComponent price={price} token={token} chainId={chainId} />
            <Label>Refund Address</Label>
            <Input
                className='disabled:cursor-grab disabled:text-black'
                value={refundAddress}
                disabled
            />
        </DialogContent>
    )
}

