'use client';

import { WALLETS } from '@/constants/wallets';
import { useWalletContext } from '@/context/WalletContext';
import { WalletId } from '@/lib/types/WalletContextTypes';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useConnect } from 'wagmi';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { getWallet } from '@/lib/walletUtils';

export function WalletListModal({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) {
  const { connectWallet, connectedWallets, currentAccount, currentWallet } = useWalletContext();
  const { connectors: evmConnectors } = useConnect();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  // console.log("evmconnn", evmConnectors);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput placeholder='Search a wallet...' />
      <CommandList className='max-h-[600px] pb-1'>
        <CommandEmpty>No wallets.</CommandEmpty>

        <CommandGroup heading='Ethereum'>
          {evmConnectors.map((wallet: any) => (
            <CommandItem
              key={wallet.name}
              value={wallet.name}
              disabled={false}
              // disabled={
              //   !getWallet(wallet.id as WalletId) ||
              //   getWallet(wallet.id as WalletId)?.disabled ||
              //   connectedWallets['evm']?.[wallet.id as WalletId]?.loading
              // }
              onSelect={() => connectWallet(wallet.id as WalletId)}
              className='flex cursor-pointer gap-2 text-text2'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className='h-6 w-6 rounded-[0.5rem] '
                alt=''
                src={wallet.icon || getWallet(wallet.id as WalletId)?.icon || ''}
              />
              <span>{wallet.name}</span>

              <span className='ml-auto'></span>

              {currentWallet?.id === wallet.id && (
                <span className='h-2 w-2 rounded-sm bg-green-400 p-1 outline outline-2 outline-offset-2 outline-green-800' />
              )}

              {connectedWallets['evm'][wallet.id as WalletId]?.loading && (
                <span className='rounded-xs  px-2 py-1 font-mono text-xs'>Loading...</span>
              )}
              {connectedWallets['evm'][wallet.id as WalletId]?.address && (
                <span className='rounded-xs  px-2 py-1 font-mono text-xs'>
                  {connectedWallets['evm'][wallet.id as WalletId]?.address.slice(0, 6)}...
                  {connectedWallets['evm'][wallet.id as WalletId]?.address.slice(-4)}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* <CommandGroup heading='Tron'>
          {WALLETS.filter((wallet) => wallet.type === 'tron').map((wallet) => (
            <CommandItem
              key={wallet.id}
              value={wallet.id}
              disabled={
                !getWallet(wallet.id as WalletId) ||
                getWallet(wallet.id as WalletId)?.disabled ||
                connectedWallets['tron'][wallet.id as WalletId]?.loading
              }
              onSelect={() => {
                connectWallet(wallet.id);
              }}
              className='flex cursor-pointer gap-2'
            >
              <Image
                className='h-6 w-6 rounded-[0.5rem]'
                alt=''
                src={wallet.icon}
                width={128}
                height={128}
              />
              <span>{wallet.name}</span>

              {connectedWallets['tron'][wallet.id as WalletId]?.loading && (
                <span className='rounded-xs bg-neutral-700 px-2 py-1 font-mono text-xs'>Loading...</span>
              )}

              <span className='ml-auto'></span>

              {currentWallet?.id === wallet.id && (
                <span className='h-2 w-2 rounded-sm bg-green-400 p-1 outline outline-2 outline-offset-2 outline-green-800' />
              )}

              {connectedWallets['tron'][wallet.id as WalletId]?.address && (
                <span className='rounded-xs bg-neutral-700 px-2 py-1 font-mono text-xs'>
                  {connectedWallets['tron'][wallet.id as WalletId]?.address.slice(0, 6)}...
                  {connectedWallets['tron'][wallet.id as WalletId]?.address.slice(-4)}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading='Cosmos'>
          {WALLETS.filter((wallet) => wallet.type === 'cosmos').map((wallet) => (
            <CommandItem
              key={wallet.id}
              value={wallet.id}
              disabled={wallet.disabled || connectedWallets['cosmos'][wallet.id as WalletId]?.loading}
              onSelect={() => {
                connectWallet(wallet.id);
              }}
              className='flex cursor-pointer gap-2'
            >
              <Image
                className='h-6 w-6 rounded-[0.5rem]'
                alt=''
                src={wallet.icon}
                width={128}
                height={128}
              />
              <span>{wallet.name}</span>

              <span className='ml-auto'></span>

              {connectedWallets['cosmos'][wallet.id as WalletId]?.loading && (
                <span className='rounded-xs bg-neutral-700 px-2 py-1 font-mono text-xs'>Loading...</span>
              )}
              {connectedWallets['cosmos'][wallet.id as WalletId]?.address && (
                <span className='rounded-xs bg-neutral-700 px-2 py-1 font-mono text-xs'>
                  {connectedWallets['cosmos'][wallet.id as WalletId]?.address.slice(0, 6)}...
                  {connectedWallets['cosmos'][wallet.id as WalletId]?.address.slice(-4)}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup> */}
      </CommandList>
    </CommandDialog>
  );
}
