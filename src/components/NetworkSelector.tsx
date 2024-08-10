'use client';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CHAINS, ChainIds } from '@/constants/chains';
import { capitalized, cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import Image from 'next/image';
import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Control, FieldValues } from 'react-hook-form';

export const NetworkSelect = ({
  chains,
  control,
  name,
}: {
  chains: ChainIds[];
  control?: Control<FieldValues> | undefined;
  name: string
}) => {
  return (
    <FormField
      control={control}
      name={name ?? "chainId"}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Chain</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Chain" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <Command className='max-h-[80svh]'>
                <NetworkSearchInput placeholder='Polygon, Arbitrum...' />

                <CommandList>
                  <CommandEmpty>No network found.</CommandEmpty>

                  <CommandGroup>
                    {
                      chains.map((chainId, index) => (
                        <NetworkSelectItem
                          key={chainId}
                          chainId={chainId}
                          chainName={CHAINS[chainId]}
                        />
                      ))
                    }
                  </CommandGroup>
                </CommandList>
              </Command>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  )
};

const NetworkSelector = ({
  currentChainId,
  setChain,
  chains,
  disabled,
}: {
  currentChainId: ChainIds;
  setChain: (c: ChainIds) => void;
  chains: ChainIds[];
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const [popoverWidth, setPopoverWidth] = useState(0);
  const buttonRef = useRef<ElementRef<'button'>>(null);

  const { width = 0 } = useWindowSize({ debounceDelay: 300 });

  useEffect(() => {
    if (buttonRef.current) {
      setPopoverWidth(buttonRef.current.clientWidth);
    }
  }, [buttonRef, width]);

  return (
    <Popover
      open={open}
      onOpenChange={() => (disabled ? undefined : setOpen(!open))}
    >
      <PopoverTrigger
        asChild
        disabled={disabled}
        className='disabled:cursor-wait '
      >
        <Button
          disabled={disabled}
          ref={buttonRef}
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full flex-1 justify-start gap-2 px-3 text-xs font-normal ring-offset-background placeholder:text-muted-foreground focus:outline-none  focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed'
        >
          {currentChainId ? (
            <Image
              src={`/images/chains/${CHAINS[currentChainId].toLowerCase()}.png`}
              alt={''}
              width={17}
              height={17}
              priority={true}
              className='inline-block h-5 w-5 rounded-full bg-white'
            />
          ) : (
            <div className='h-5 w-5 rounded-full border-[1px]'></div>
          )}

          {currentChainId ? capitalized(CHAINS[currentChainId]) : 'Select Network'}
          <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={'p-0 z-99 bg-bg1'}
        style={{ width: popoverWidth }}
      >
        <Command className='max-h-[80svh]'>
          <NetworkSearchInput placeholder='Polygon, Arbitrum...' />

          <CommandList>
            <CommandEmpty>No network found.</CommandEmpty>

            <CommandGroup>
              {chains.map((chainId, index) => (
                <NetworkListItem
                  key={chainId}
                  itemKey={CHAINS[chainId] + ' - ' + chainId}
                  setOpen={setOpen}
                  setChain={setChain}
                  chainId={chainId}
                  chainName={CHAINS[chainId]}
                  currentChainId={currentChainId}
                />
              ))}
              {/* {Object.entries(SUPPORTED_CHAIN_IDS)
                .filter(([_, chainId]) =>
                  testnet ? CHAINS_DATA[chainId].testnet === true : !CHAINS_DATA[chainId].testnet,
                )
                .sort((c1, c2) => (c1[0] < c2[0] ? -1 : 1))
                .map(([chainName, chainId], index) => (
                  <NetworkListItem
                    key={chainId}
                    itemKey={chainName + ' - ' + chainId}
                    setOpen={setOpen}
                    setChain={setChain}
                    chainId={chainId}
                    chainName={chainName}
                    currentChainId={currentChainId}
                  />
                ))} */}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const NetworkSelectItem = ({
  chainId,
  chainName,
}: {
  chainId: ChainIds;
  chainName: string;
}) => {
  return (
    <SelectItem value="m@example.com">
      <Image
        src={`/images/chains/${chainName.toLowerCase()}.png`}
        alt={''}
        width={20}
        height={20}
        priority={true}
        className='inline-block h-5 w-5 rounded-full bg-white'
      />

      <span>{capitalized(chainName)}</span>
    </SelectItem>
  )
}

const NetworkListItem = ({
  chainId,
  chainName,
  currentChainId,
  setOpen,
  setChain,
  itemKey,
}: {
  chainId: ChainIds;
  chainName: string;
  currentChainId: ChainIds;
  itemKey: string;
  setChain: (chain: ChainIds) => void;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <CommandItem
      value={itemKey}
      onSelect={() => {
        setChain(chainId);
        setOpen(false);
      }}
      className='flex cursor-pointer gap-2 text-xs'
    >
      <Image
        src={`/images/chains/${chainName.toLowerCase()}.png`}
        alt={''}
        width={20}
        height={20}
        priority={true}
        className='inline-block h-5 w-5 rounded-full bg-white'
      />

      <span>{capitalized(chainName)}</span>

      <Check className={cn('ml-auto h-4 w-4', chainId === currentChainId ? 'opacity-100' : 'opacity-0')} />
    </CommandItem>
  );
};

const NetworkSearchInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className='flex items-center border-b px-3'
    cmdk-input-wrapper=''
  >
    <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));
NetworkSearchInput.displayName = 'NetworkSearchInput';

export default NetworkSelector;
