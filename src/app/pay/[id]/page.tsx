"use client";
import ProfileView from '@/components/merchant/profileView';
import OfferingDisplay from '@/components/offerings/offeringDisplay';
import PayComponent, { paymentSchema } from '@/components/pay';
import { useMerchant } from '@/lib/hooks/merchant';
import { useOffering } from '@/lib/hooks/useOfferings';
import { TokenSchema } from '@/lib/types/token';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import React from 'react'
import { Form, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';



const PayPage = () => {
    const { id } = useParams<{ id: string }>();
    const {
        useFetchOfferingById,
    } = useOffering()
    const {
        data: offering,
        isLoading: offeringIsLoading,
    } = useFetchOfferingById(parseInt(id))

    const createPaymentForm = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            fromToken: undefined,
            refundAddress: undefined,
        }
    });

    function onSubmit(values: z.infer<typeof paymentSchema>) {

        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        // createMerchant(values)
    }

    return (
        <>
            <div className="flex min-h-svh flex-col md:flex-row md:justify-between">
                <div className="w-full md:w-1/2">
                    {
                        offering && (
                            <ProfileView
                                metadata={offering.merchant.metadata}
                            >
                                {
                                    offering?.metadata && (
                                        <OfferingDisplay
                                            metadata={offering?.metadata}
                                            price={offering?.price}
                                            stock={offering?.stock}
                                        />
                                    )
                                }
                            </ProfileView>
                        )
                    }
                </div>
                <div className="w-full px-2 max-w-prose mt-7 md:mt-0 md:w-1/2">
                    {/* <FormProvider {...createPaymentForm}> */}
                    <div className="space-y-6 h-full flex">
                        {
                            offering?.merchant.walletAddress && offering?.merchant.baseToken &&
                            <PayComponent
                                price={offering?.price.toString()}
                                merchantAddress={offering?.merchant.walletAddress}
                                merchantToken={offering?.merchant.baseToken}
                            />
                        }
                    </div>
                    {/* </FormProvider> */}
                </div>
            </div>

        </>
    )
}

export default PayPage

// onSubmit={createPaymentForm.handleSubmit(onSubmit)}