'use client';

import { useWalletContext } from '@/context/WalletContext';
import { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { AccountModal } from './AccountModal';
import { WalletListModal } from './WalletListModal';
import { emojiAvatarForAddress } from '@/lib/emojiAvatarForAddress';
import { zeroAddress } from 'viem';
import { cn } from '@/lib/utils';

const WalletButton = () => {
  const { currentAccount, openWalletModal } = useWalletContext();

  const { color: backgroundColor, emoji } = useMemo(
    () => emojiAvatarForAddress(currentAccount?.address || zeroAddress),
    [currentAccount?.address],
  );

  return (
    <>
      <Button
        onClick={openWalletModal}
        className='gap-1 rounded-full'
      >
        {currentAccount ? (
          // <span className='mr-2 h-2 w-2 rounded-sm bg-green-400 p-1 outline outline-2 outline-offset-2 outline-green-800' />
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-3xl text-base leading-none',
              '-ml-3 select-none bg-slate-700',
            )}
            style={{ backgroundColor }}
          >
            <span className='drop-shadow-[0px_0px_4px_#ffffff]'>{emoji}</span>
          </div>
        ) : (
          'Connect Wallet'
        )}
        {currentAccount && `${currentAccount?.address?.slice(0, 6)}...${currentAccount?.address?.slice(-4)}`}
      </Button>
    </>
  );
};

export const DefaultWalletButton = () => {
  return <Button className='rounded-full'>Connect Wallet</Button>;
};

export default WalletButton;
