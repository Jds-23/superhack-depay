import { Metadata } from '@/lib/types/metadata'
import { formatNumber } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import { formatUnits } from 'viem'

type OfferingDisplayProps = {
    metadata: Metadata
    price: bigint
    stock: number
}
const OfferingDisplay = ({
    metadata,
    price,
    stock,
}: React.HTMLAttributes<HTMLDivElement> & OfferingDisplayProps) => {
    return (
        <div className='relative m-auto flex justify-center items-center'>
            <div className="m-auto">
                <h2 className='text-lg font-semibold'>{metadata.name}</h2>
                <h2 className='text-xl font-bold'>${formatNumber(formatUnits(price, 6))}</h2>
                <img
                    src={`/product.png`}
                    alt={''}
                    className='object-contain w-full max-w-56 rounded-lg bg-white'
                />
                <div>
                    <h4 className='text-sm font-normal text-muted-foreground'>{metadata.description}</h4>
                </div>
            </div>
        </div>
    )
}

export default OfferingDisplay