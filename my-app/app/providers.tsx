'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { SessionProvider } from 'next-auth/react';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';

import { config } from '../wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
       <SessionProvider refetchInterval={0}>
      <QueryClientProvider client={queryClient}>
      <RainbowKitSiweNextAuthProvider>
        <RainbowKitProvider >{children}</RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
}
