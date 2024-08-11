import { TPaymentStatus } from "./dialog"

export const waitingForSourceConfirmation: TPaymentStatus[] = [
    {
        status: 'pending',
        text: 'Confirming for source',
    },
    {
        status: 'waiting',
        text: 'Waiting for source confirmation',
    },
]

export const onSourceError: TPaymentStatus[] = [
    {
        status: 'error',
        text: 'Error in source',
    },
    {
        status: 'waiting',
        text: 'Error in source',
    },
]

export const onSourceConfirm: TPaymentStatus[] = [
    {
        status: 'success',
        text: 'Confirmed in source',
    },
    {
        status: 'pending',
        text: 'Confirming for destination',
    },
]

export const onDestinationError: TPaymentStatus[] = [
    {
        status: 'success',
        text: 'Confirmed in source',
    },
    {
        status: 'error',
        text: 'Error in destination',
    },
]

export const onDestinationConfirm: TPaymentStatus[] = [
    {
        status: 'success',
        text: 'Confirmed in source',
    },
    {
        status: 'success',
        text: 'Confirmed in destination',
    },
]