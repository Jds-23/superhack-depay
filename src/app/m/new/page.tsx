"use client";
import CreateMerchant from '@/components/merchant/create'
import ProfileView from '@/components/merchant/profileView';
import { useWalletContext } from '@/context/WalletContext';
import { createMerchantSchema, useMerchant } from '@/lib/hooks/merchant';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';


const New = () => {
    const {
        currentAccount,
        openWalletModal,
    } = useWalletContext()
    const { useCreateMerchant } = useMerchant()
    const {
        mutateAsync: createMerchant,
        isPending,
        status,
    } = useCreateMerchant()

    const createMerchantForm = useForm<z.infer<typeof createMerchantSchema>>({
        resolver: zodResolver(createMerchantSchema),
        defaultValues: {
            walletAddress: currentAccount?.address,
            metadata: {
                name: '',
                description: '',
            },
        }
    });

    useEffect(() => {
        if (currentAccount) {
            createMerchantForm.setValue('walletAddress', currentAccount.address)
        }
    }, [currentAccount, createMerchantForm])

    function onSubmit(values: z.infer<typeof createMerchantSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        createMerchant(values).then(() => {
            toast("Your merchant profile is created.")
            window.location.href = '/m'
        }).catch(() => {
            toast("Failed to create merchant profile.")
        });
    }

    return (
        <>
            <div className="flex min-h-svh flex-col md:flex-row md:justify-between">
                <div className="w-full md:w-1/2 md:order-last">
                    <ProfileView
                        metadata={createMerchantForm.watch('metadata')}
                    />
                </div>
                <div className="w-full px-2 mt-7 md:mt-0 md:w-1/2">
                    <FormProvider {...createMerchantForm}>
                        <form onSubmit={createMerchantForm.handleSubmit(onSubmit)} className="space-y-6 h-full flex">
                            <CreateMerchant
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

export default New