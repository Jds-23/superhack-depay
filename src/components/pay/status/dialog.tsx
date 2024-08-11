import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CircleProgress } from "./progress";
import Image from "next/image";

export type TPaymentStatus = {
    status: 'waiting' | 'success' | 'error' | 'pending';
    text: string;
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
                                    <a href={`https://blockscout.com/polygon/mainnet/tx/${hashes[index]}`} className='flex gap-2 underline' target="_blank" rel="noreferrer">
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