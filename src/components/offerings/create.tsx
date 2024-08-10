import { createOfferingSchema } from '@/lib/hooks/useOfferings';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import React from 'react'
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { CurrencyInput, Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';
type CreateOfferingProps = {
    isPending: boolean;
    status: string;
}

const CreateOffering = ({ className, isPending, ...rest }: React.HTMLAttributes<HTMLDivElement> & CreateOfferingProps) => {
    const createOfferingForm = useFormContext<z.infer<typeof createOfferingSchema>>();

    return (
        <>
            <div className={cn('sm:pl-9 my-auto', className)}>
                {/* Link go back to dash board with an back arrow */}
                <div className='flex text-muted-foreground items-center mb-1' onClick={
                    () => {
                        window.location.href = '/m/dashboard'
                    }
                }>
                    <ArrowLeftIcon />
                    <p className='text-sm cursor-pointer font-semibold underline'>Back</p>
                </div>
                <h1 className='text-lg sm:text-2xl font-semibold'>
                    Create A Product
                </h1>
                {
                    createOfferingForm &&
                    <div className="space-y-3">
                        <FormField
                            control={createOfferingForm.control}
                            name="metadata.name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Table" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Give A Catchy Name To Your Product
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createOfferingForm.control}
                            name="metadata.description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Sturdy table to play WWE or to make love." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        About your product in a few words for your customers to know what they are buying.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createOfferingForm.control}
                            name="isUnlimited"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Is A Service</FormLabel>
                                        <FormDescription>
                                            Check this if you are offering a service instead of a product.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createOfferingForm.control}
                            disabled={createOfferingForm.watch('isUnlimited')}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input min={1} disabled={createOfferingForm.watch("isUnlimited")} type="number" placeholder="100" onChange={e => {
                                            field.onChange({ target: { value: parseInt(e.target.value) } })
                                        }} value={field.value}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref} />
                                    </FormControl>
                                    <FormDescription>
                                        How many products you have in stock.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createOfferingForm.control}
                            name="price"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <CurrencyInput type="number" placeholder="100" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The price of your product in USD.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" isLoading={isPending} variant="default" className='w-full'>
                                Create Product
                            </Button>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default CreateOffering