"use client";
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/context/WalletContext';
import { useMerchant } from '@/lib/hooks/merchant';
import Image from 'next/image';
import React, { useState } from 'react'
import Logo from "@/assets/logo.svg";
import ProfileView from '@/components/merchant/profileView';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';
import { formatUnits } from 'viem';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CopyIcon } from '@radix-ui/react-icons';
import { WEB_APP } from '@/constants/env';

const M = () => {
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

    const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

    const copyLinkToClipboard = (id: string) => {
        const link = `${WEB_APP}pay/${id}`;
        navigator.clipboard.writeText(link).then(() => {
            // alert('Link copied to clipboard');
            setCopiedOrderId(id);
            setTimeout(() => {
                setCopiedOrderId(null);
            }, 2000);
        }).catch((err) => {
            console.error('Failed to copy link: ', err);
        });
    };
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
                    <>
                        <div className="flex min-h-svh flex-col md:flex-row md:justify-between">
                            <div className="w-full">
                                <ProfileView
                                    metadata={merchant.metadata}
                                >
                                    <div className='space-y-3 mt-3'>
                                        <div className='rounded-lg p-4 bg-background'>
                                            <h1 className='text-2xl font-bold'>Get started DePay</h1>
                                            <div className='flex space-x-5'>
                                                {/* <Link href={'/m/o/new'}> */}
                                                <Card onClick={() => {
                                                    window.location.href = '/m/o/new'
                                                }} className='max-w-72 group w-full sm:w-1/2 p-2 overflow-hidden cursor-pointer'>
                                                    <div className='flex items-center'>
                                                        <h6 className='font-bold'>Share a payment link</h6>
                                                        <ArrowRight className='' size={16} />
                                                    </div>
                                                    <sub className='text-muted-foreground'>Share a payment link with your customers</sub>
                                                    <div className='w-full translate-y-6 group-hover:translate-y-3 transition-all flex justify-center items-center'>
                                                        <img
                                                            src={`/product.png`}
                                                            alt={''}
                                                            className='object-contain w-full max-w-36 rounded-lg bg-white'
                                                        />
                                                    </div>
                                                </Card>
                                                {/* </Link> */}
                                                <Card className='hidden sm:block max-w-72 grayscale w-1/2 p-2 overflow-hidden cursor-not-allowed'>
                                                    <div className='flex items-center'>
                                                        <h6>Send a invoice</h6>
                                                        <Badge className='ml-1' variant="outline">Coming Soon</Badge>
                                                    </div>
                                                    <sub className='text-muted-foreground'>Send a invoice to your customers</sub>
                                                    <div className='w-full translate-y-6 transition-all flex justify-center items-center'>
                                                        <img
                                                            src={`/product.png`}
                                                            alt={''}
                                                            className='object-contain w-full max-w-36 rounded-lg bg-white'
                                                        />
                                                    </div>
                                                </Card>
                                            </div>

                                        </div>
                                        <div>
                                            <h1 className='text-2xl font-bold'>Products</h1>
                                            <div className='px-12'>
                                                <Carousel
                                                    opts={{
                                                        align: "start",
                                                    }}
                                                    className="w-full"
                                                >
                                                    <CarouselContent>
                                                        {merchant.offerings.map((offering, index) => (
                                                            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/5 aspect-square">
                                                                <div className="p-1">
                                                                    <Card className='p-2 overflow-hidden cursor-not-allowed'>
                                                                        <div className='w-full flex'>
                                                                            <img
                                                                                src={`/product.png`}
                                                                                alt={''}
                                                                                className='object-contain w-8/12 max-w-36 rounded-lg bg-white'
                                                                            />
                                                                        </div>
                                                                        <h6 className='font-bold text-lg'>{
                                                                            offering?.metadata?.name ?? 'Product Name'
                                                                        }</h6>
                                                                        <p className='text-muted-foreground text-xs'>
                                                                            {
                                                                                offering?.metadata?.description ?? 'Product Description Missing'
                                                                            }
                                                                        </p>

                                                                        <sub className='font-bold text-xl'>$
                                                                            {formatNumber(formatUnits(offering.price, 6))}
                                                                        </sub>
                                                                        <div className="mt-1 flex items-center space-x-2">
                                                                            <div className="grid flex-1 gap-2">
                                                                                <Label htmlFor="link" className="sr-only">
                                                                                    Link
                                                                                </Label>
                                                                                <Input
                                                                                    id="link"
                                                                                    defaultValue={`${WEB_APP}pay${offering.id}`}
                                                                                    readOnly
                                                                                />
                                                                            </div>
                                                                            <Button onClick={() => copyLinkToClipboard(offering.id)} variant={"ghost"} size="sm" className="px-3">
                                                                                <span className="sr-only">Copy</span>
                                                                                {
                                                                                    copiedOrderId === offering.id ?
                                                                                        <Check width={12} height={12} className='animate-bounce text-green-700' />
                                                                                        :
                                                                                        <Copy width={10} height={10} className='text-green-700 m-[1px]' />
                                                                                }
                                                                            </Button>
                                                                        </div>
                                                                    </Card>
                                                                </div>
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious />
                                                    <CarouselNext />
                                                </Carousel>
                                            </div>
                                        </div>
                                    </div>
                                </ProfileView>
                            </div>
                        </div>
                    </>
                )
            }

        </>
    )
}

export default M