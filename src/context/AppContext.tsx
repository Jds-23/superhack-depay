'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WalletContextProvider from './WalletContext';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './WagmiContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const AppContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <WalletContextProvider>{children}</WalletContextProvider>
      </WagmiProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppContext;
