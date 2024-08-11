import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CircleProgress } from "./progress";
import Image from "next/image";

export type TPaymentStatus = {
    status: 'waiting' | 'success' | 'error' | 'pending';
    text: string;
    chainId?: number;
}
export const addresses = {
    "10": "0xe40Ad0ba24f0861995dCFcBb5C2192Fc92dfF85C",
    "8453": "0x7d25814114274F2A22d8bE43F575964890F0c8a9",
    "34443": "0x5C96CD07f3034670f297d567CD1517665F31c58F",
}

const explorers: {
    [key: number]: string
} = {
    10: "https://optimism.blockscout.com/",
    8453: "https://base.blockscout.com/",
    34443: "https://explorer.mode.network/",
}

const PaymentStatusDialog = ({
    hashes,
    statusArray
}: {
    hashes: string[]
    statusArray: TPaymentStatus[]
}) => {

    const waitingForSourceConfirmation: TPaymentStatus[] = [
        {
            status: 'pending',
            text: 'Confirming for source',
        },
        {
            status: 'waiting',
            text: 'Waiting for source confirmation',
        },
    ]

    const onSourceError: TPaymentStatus[] = [
        {
            status: 'error',
            text: 'Error in source',
        },
        {
            status: 'waiting',
            text: 'Error in source',
        },
    ]

    const onSourceConfirm: TPaymentStatus[] = [
        {
            status: 'success',
            text: 'Confirmed in source',
        },
        {
            status: 'pending',
            text: 'Confirming for destination',
        },
    ]

    const onDestinationError: TPaymentStatus[] = [
        {
            status: 'success',
            text: 'Confirmed in source',
        },
        {
            status: 'error',
            text: 'Error in destination',
        },
    ]

    const onDestinationConfirm: TPaymentStatus[] = [
        {
            status: 'success',
            text: 'Confirmed in source',
        },
        {
            status: 'success',
            text: 'Confirmed in destination',
        },
    ]
    return (
        <DialogContent className="sm:max-w-[525px] rounded-xl space-y-0">
            <DialogHeader>
                <DialogTitle>Your Transaction is Processing</DialogTitle>
                <DialogDescription>
                    Wait For The Transaction To Be Confirmed
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 pb-4">
                {
                    statusArray.map((status, index) => (
                        <div key={index} className='flex gap-2 items-center'>
                            <CircleProgress
                                status={status.status}
                                index={index + 1}
                            />
                            {
                                hashes[index] ?
                                    <a href={`${explorers[status?.chainId ?? 0] ?? 'https://explorer.routernitro.com/tx/'}${hashes[index]}`} className='flex gap-2 underline' target="_blank" rel="noreferrer">
                                        <p>{status.text}</p>
                                        <Image
                                            src={`/blockscout.png`}
                                            alt={''}
                                            width={17}
                                            height={17}
                                            priority={true}
                                            className='inline-block h-5 w-5 bg-white'
                                        />
                                    </a> :
                                    <p>{status.text}</p>
                            }
                        </div>
                    ))
                }
            </div>
        </DialogContent>
    )
}

export default PaymentStatusDialog