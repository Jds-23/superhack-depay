import useTokenCalculations from '@/lib/hooks/useTokenCalculation';
import { Token } from '@/lib/types/token';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { formatUnits, parseUnits } from 'viem';

interface AmountInputProps {
    token?: Token;
    inputValue: string;
    inputInFiat: boolean;
    error?: string;
    editable: boolean;
}

interface AmountInputContextProps extends AmountInputProps {
    toggleInputInFiat: (newInputValue: string) => void;
    handleInputChange: (newInputValue: string) => void;
    updateToken: (token: Token) => void;
    setInitialAmount: (amont: bigint, baseToken: Token) => void;
}

const defaultValues: AmountInputProps = {
    inputValue: '',
    inputInFiat: false,
    error: undefined,
    editable: true,
};

const AmountInputContext = createContext<AmountInputContextProps>({
    ...defaultValues,
    toggleInputInFiat: () => { },
    handleInputChange: () => { },
    updateToken: () => { },
    setInitialAmount: () => { },
});

const AmountInputProvider: React.FC<{ children: ReactNode, initialState: AmountInputProps }> = ({ children, initialState }) => {
    const [state, setState] = useState<AmountInputProps>(initialState);
    const { getTokenAmount, getTokenAmountInUSD, pricelistIsLoading } = useTokenCalculations();

    const setInitialAmount = useCallback((amont: bigint, baseToken: Token) => {
        const { token } = state;
        if (pricelistIsLoading) return;
        if (!token) return;

        const inputUSDAmount = getTokenAmountInUSD({
            value: formatUnits(amont, baseToken.decimals), token: baseToken
        });
        const inputOtherTokenAmount = getTokenAmount({
            value: formatUnits(inputUSDAmount, 6), token
        });
        setState(prevState => ({
            ...prevState,
            inputValue: prevState.inputInFiat ? formatUnits(inputUSDAmount, 6) : formatUnits(inputOtherTokenAmount, token?.decimals ?? 0),
        }));
    }, [state, pricelistIsLoading, getTokenAmountInUSD, getTokenAmount, formatUnits]);



    const toggleInputInFiat = (newInputValue: string) => {
        // if (!token || inputValue === "") {
        setState(prevState => ({
            ...prevState,
            inputInFiat: !prevState.inputInFiat,
            inputValue: newInputValue,
        }));
        return;
        // }

        // const toggledInputValue = state.inputInFiat ? formatUnits(inputTokenAmount, token.decimals) : formatUnits(inputUSDAmount, 6)
        // setState(prevState => ({
        //     ...prevState,
        //     inputInFiat: !prevState.inputInFiat,
        //     inputValue: toggledInputValue,
        // }));
    };

    const handleInputChange = (newInputValue: string) => {
        const { token, editable } = state;
        if (!token) return;
        if (!editable) return;
        setState(prevState => ({
            ...prevState,
            inputValue: newInputValue,
        }));
    };

    const updateToken = (token: Token) => {
        setState(prevState => {
            if (prevState.token?.address === token.address) return prevState;

            if (prevState.inputInFiat)
                return {
                    ...prevState,
                    token,
                };

            const inputUSDAmount = getTokenAmountInUSD({
                value: prevState.inputValue, token: prevState.token
            });
            const inputTokenAmount = getTokenAmount({
                value: formatUnits(inputUSDAmount, 6), token
            });
            return {
                ...prevState,
                token,
                inputValue: formatUnits(inputTokenAmount, token.decimals),
            };
        });
    };

    return (
        <AmountInputContext.Provider
            value={{
                ...state,
                toggleInputInFiat,
                handleInputChange,
                setInitialAmount,
                updateToken,
            }}
        >
            {children}
        </AmountInputContext.Provider>
    );
};

const useAmountInputContext = () => {
    const {
        inputInFiat,
        inputValue,
        token,
        toggleInputInFiat,
        updateToken,
        setInitialAmount,
        error,
        handleInputChange
    } = useContext<AmountInputContextProps>(AmountInputContext);
    const { getTokenAmount, getTokenAmountInUSD } = useTokenCalculations();

    const inputUSDAmount = inputInFiat ? parseUnits(inputValue, 6) : getTokenAmountInUSD({
        value: inputValue, token
    });
    const inputTokenAmount = inputInFiat ? getTokenAmount({
        value: inputValue,
        token
    }) : parseUnits(inputValue, token?.decimals ?? 0);

    const inputWidth = `${Math.max(30, inputValue.replace(".", "").length * 23)}px`;

    return {
        inputInFiat,
        inputValue,
        token,
        toggleInputInFiat,
        updateToken,
        setInitialAmount,
        error,
        handleInputChange,
        inputUSDAmount,
        inputTokenAmount,
        inputWidth
    };
};

export { AmountInputProvider, useAmountInputContext };