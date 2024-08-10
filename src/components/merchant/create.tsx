import React, { useState } from 'react'
import { Input } from '../ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormContext } from "react-hook-form"
import { z } from 'zod'
import { createMerchantSchema, useMerchant } from '@/lib/hooks/merchant'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { cn } from '@/lib/utils';
import NetworkSelector, { NetworkSelect } from '../NetworkSelector';
import { ChainIds } from '@/constants/chains';
import CurrencyAndChainSelector from '../currencyAndChainSelector';
import { ArrowLeft } from 'lucide-react'

type CreateMerchantProps = {
    isPending: boolean;
    status: string;
}

const CreateMerchant = ({ className, isPending, ...rest }: React.HTMLAttributes<HTMLDivElement> & CreateMerchantProps) => {
    // const createMerchantForm = useForm<z.infer<typeof createMerchantSchema>>({
    //     resolver: zodResolver(createMerchantSchema),
    //     defaultValues: {
    //         walletAddress: '',
    //         metadata: {
    //             name: '',
    //             description: '',
    //         },
    //     }
    // });
    const createMerchantForm = useFormContext();


    const [chainId, seChainId] = useState<ChainIds>("137");

    return (
        <div className={cn('sm:pl-9 my-auto', className)}>
            {/* Link go back to dash board with an back arrow */}
            <div className='flex text-muted-foreground items-center mb-1' onClick={
                () => {
                    window.location.href = '/m/dashboard'
                }
            }>
                <ArrowLeft size={20} />
                <p className='text-sm cursor-pointer font-semibold underline'>Back</p>
            </div>
            <h1 className='text-lg sm:text-2xl font-semibold'>
                Create Merchant Your Merchant Profile
            </h1>
            {
                createMerchantForm &&
                <div className="space-y-3">
                    <FormField
                        control={createMerchantForm.control}
                        name="metadata.name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Merchant Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This could either be your business name or your personal name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={createMerchantForm.control}
                        name="metadata.description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Merchant Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    About your business or yourself.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={createMerchantForm.control}
                        name='baseToken'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Base Token</FormLabel>
                                <CurrencyAndChainSelector
                                    setSourceChainId={seChainId}
                                    sourceChainId={chainId}
                                    testnet={false}
                                    sourceToken={field.value}
                                    setSourceToken={(value) => field.onChange({ target: { value } })}
                                />
                                <FormDescription>
                                    The token you want to accept as payment.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isPending} type="submit" className='w-full'>Submit</Button>
                </div>
            }

        </div>
    )
}

export default CreateMerchant