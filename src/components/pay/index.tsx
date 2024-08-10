import { Token, TokenSchema } from '@/lib/types/token';
import { cn, formatNumber, getTokenLogoURI } from '@/lib/utils';
import React, { use, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { Separator } from '../ui/separator';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import CurrencyAndChainSelector from '../currencyAndChainSelector';
import { ChainIds, CHAINS } from '@/constants/chains';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import CoolQRCode, { AddressQRCode } from '../coolqr';

export const paymentSchema = z.object({
    fromToken: TokenSchema,
    refundAddress: z.string(),
});

type PayComponentProps = {
    price: string;
    merchantAddress: string;
    merchantToken: Token;
}


const PayComponent = ({
    price,
    merchantAddress,
    merchantToken,
}: React.HTMLAttributes<HTMLDivElement> & PayComponentProps) => {
    const paymentForm = useFormContext<z.infer<typeof paymentSchema>>();
    const [chainId, seChainId] = useState<ChainIds>("137");
    const [open, setOpen] = useState(true);
    const token = paymentForm.watch('fromToken')

    useEffect(() => {
        if (token && token.chainId !== chainId) {
            paymentForm.resetField('fromToken')
        }
    }, [chainId, token])

    const InfoComponent: React.FC = () => {
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

    return (
        <>
            <Dialog open={open} onOpenChange={() => { setOpen(prv => !prv) }} >
                {/* <DialogTrigger>Open</DialogTrigger> */}
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
                        <AddressQRCode
                            address='0xD253eDAF1B53a2E0e5E1B8021ba4937D21806dd3'
                            imgStr={token && getTokenLogoURI(token.address, CHAINS[token.chainId as ChainIds])}
                        />
                    </div>
                    <InfoComponent />
                    <Label>Refund Address</Label>
                    <Input
                        className='disabled:cursor-grab disabled:text-black'
                        value={paymentForm.watch('refundAddress')}
                        disabled
                    />
                </DialogContent>
            </Dialog>
            <div className={cn('sm:pl-9 my-auto space-y-3')}>
                <h1 className='text-lg sm:text-2xl font-semibold'>
                    Payment method
                </h1>
                <sub className='text-sm underline text-muted-foreground'>
                    Important Note: Please pay the exact amount and in selected Chain and Asset!
                </sub>

                <InfoComponent />

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
                <Button type="submit" className='w-full'>Pay Via QR</Button>
                <Button type="button" onClick={() => {
                    setOpen(true)
                }} variant={"outline"} className='w-full'>Connect Wallet</Button>
            </div>
        </>
    )
}

export default PayComponent

const PayViaQRModal = () => {

}