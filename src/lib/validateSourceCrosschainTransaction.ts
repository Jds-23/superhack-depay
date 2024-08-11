import { TransactionReceipt } from 'viem';

const validateSourceCrosschainTransaction = <T extends string | number>(
    srcTxData: TransactionReceipt,
    sourceNetworkId: T,
    destNetworkId: T,
) => {
    if (sourceNetworkId !== destNetworkId) {
        // check if FundsDepositedWithMessage event is emitted
        const fundsDepositedWithMessage = '0x3dbc28a2fa93575c89d951d683c45ddb951a2ecf6bc9b9704a61589fa0fcb70f';
        const fundsDeposited = '0x6f223106c8e3df857d691613d18d1478cc7c629a1fdf16c7b461d36729fcc7ad';

        const event = srcTxData.logs.find(
            (log) => log.topics[0] === fundsDepositedWithMessage || log.topics[0] === fundsDeposited,
        );

        if (!event) {
            return false;
        }
    }

    return true;
};

export default validateSourceCrosschainTransaction;
