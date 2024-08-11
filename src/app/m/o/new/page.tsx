"use client";
import ProfileView from '@/components/merchant/profileView';
import CreateOffering from '@/components/offerings/create';
import OfferingDisplay from '@/components/offerings/offeringDisplay';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/context/WalletContext';
import { useMerchant } from '@/lib/hooks/merchant';
import { createOfferingSchema, useOffering } from '@/lib/hooks/useOfferings';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Logo from "@/assets/logo.svg";
import { toast } from 'sonner';
import { ArrowBigRight } from 'lucide-react';

const O = () => {
    const {
        currentAccount,
        openWalletModal,
    } = useWalletContext()
    const {
        useFetchMerchantById,
    } = useMerchant()
    const {
        data: merchant,
        isLoading: merchantIsLoading,
    } = useFetchMerchantById(currentAccount?.address)
    const { useCreateOffering } = useOffering()

    const createMerchantForm = useForm<z.infer<typeof createOfferingSchema>>({
        resolver: zodResolver(createOfferingSchema),
        defaultValues: {
            metadata: {
                name: '',
                description: '',
            },
            stock: 1,
            price: undefined,
            isUnlimited: false,
        }
    });

    useEffect(() => {
        if (currentAccount) {
            createMerchantForm.setValue('merchantId', currentAccount.address)
            createMerchantForm.setValue('stock', 1)
        }
    }, [currentAccount, createMerchantForm])

    const {
        mutateAsync: createOffering,
        isPending,
        status,
    } = useCreateOffering()

    function onSubmit(values: z.infer<typeof createOfferingSchema>) {

        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        createOffering(values).then(() => {
            toast(<div className='flex justify-between'>
                <p>Product Created</p>
                <Button variant={"outline"} onClick={() => {
                    window.location.href = '/m'
                }}>
                    <ArrowBigRight size={16} />
                </Button>
            </div>
            )
            createMerchantForm.reset()
        }).catch(() => {
        })

        // createMerchant(values).then(() => {
        //     toast("Your merchant profile is created.")
        //     window.location.href = '/m'
        // }).catch(() => {
        //     toast("Failed to create merchant profile.")
        // });
        // createMerchant(values)
    }

    return (
        <>
            {
                !currentAccount && (
                    <div className='flex justify-center items-center h-screen'>
                        <Button onClick={openWalletModal}>Connect Wallet</Button>
                    </div>
                )
            }
            {
                merchantIsLoading && (
                    <div className='flex justify-center items-center h-screen'>
                        <Image src={Logo} className='animate-pulse grayscale' alt="img" />
                    </div>
                )
            }
            {
                !merchantIsLoading && !merchant && (
                    <div className='flex justify-center items-center h-screen'>
                        <Button onClick={() => {
                            window.location.href = '/m/new'
                        }}>Connect Wallet</Button>
                    </div>
                )
            }
            {
                !merchantIsLoading && merchant && (
                    <div className="flex min-h-svh flex-col md:flex-row md:justify-between">
                        <div className="w-full md:w-1/2 md:order-last">
                            {
                                merchant?.metadata && (
                                    <ProfileView
                                        metadata={merchant?.metadata}
                                    >
                                        <OfferingDisplay
                                            metadata={createMerchantForm.watch('metadata')}
                                            price={BigInt(createMerchantForm.watch('price') ?? 0)}
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
                )
            }
        </>
    )
}

export default O