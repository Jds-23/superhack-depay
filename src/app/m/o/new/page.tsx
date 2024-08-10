"use client";
import ProfileView from '@/components/merchant/profileView';
import CreateOffering from '@/components/offerings/create';
import OfferingDisplay from '@/components/offerings/offeringDisplay';
import { useMerchant } from '@/lib/hooks/merchant';
import { createOfferingSchema, useOffering } from '@/lib/hooks/useOfferings';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const O = () => {
    const merchantId = '0x0'
    const { useFetchMerchantById } = useMerchant()
    const { useCreateOffering } = useOffering()
    const { data, error, isLoading } = useFetchMerchantById(merchantId)

    const createMerchantForm = useForm<z.infer<typeof createOfferingSchema>>({
        resolver: zodResolver(createOfferingSchema),
        defaultValues: {
            merchantId: merchantId,
            metadata: {
                name: '',
                description: '',
            },
            stock: 1,
            price: undefined,
            isUnlimited: false,
        }
    });

    const {
        mutateAsync: createOffering,
        isPending,
        status,
    } = useCreateOffering()

    function onSubmit(values: z.infer<typeof createOfferingSchema>) {

        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        createOffering(values)
        // createMerchant(values)
    }

    return (
        <>
            <div className="flex min-h-svh flex-col md:flex-row md:justify-between">
                <div className="w-full md:w-1/2 md:order-last">
                    {
                        data?.metadata && (
                            <ProfileView
                                metadata={data?.metadata}
                            >
                                <OfferingDisplay
                                    metadata={createMerchantForm.watch('metadata')}
                                    price={createMerchantForm.watch('price')}
                                    stock={createMerchantForm.watch('stock')}
                                />
                            </ProfileView>
                        )
                    }
                </div>
                <div className="w-full px-2 max-w-prose mt-7 md:mt-0 md:w-1/2">
                    <FormProvider {...createMerchantForm}>
                        <form onSubmit={e => {
                            console.log('submitting')
                            console.log(createMerchantForm.getValues()) // This is empty
                            createMerchantForm.handleSubmit(onSubmit)(e)
                        }} className="space-y-6 h-full flex">
                            <CreateOffering
                                isPending={isPending}
                                status={status}
                            />
                        </form>
                    </FormProvider>
                </div>
            </div>
        </>
    )
}

export default O