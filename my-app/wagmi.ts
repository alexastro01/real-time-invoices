import {
    RainbowKitProvider,
    getDefaultConfig,
    Chain,
  } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
} from 'wagmi/chains';


const opencampus = {
    id: 41923,
    name: 'Open Campus',
    iconUrl: 'https://www.opencampus.xyz/static/media/coin-logo.39cbd6c42530e57817a5b98ac7621ca7.svg',
    iconBackground: '#fff',
    nativeCurrency: { name: 'EDU', symbol: 'EDU', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://rpc.edu-chain.raas.gelato.cloud'] },
    },
    blockExplorers: {
      default: { name: 'BlockScout', url: '	https://educhain.blockscout.com/' },
    },

  } as const satisfies Chain;

  const morph = {
    id: 2818,
    name: 'Morph',
    iconUrl: '/morph-logo.png',
    iconBackground: '#fff',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://rpc-quicknode.morphl2.io'] },
    },
    blockExplorers: {
      default: { name: 'BlockScout', url: 'https://explorer.morphl2.io/' },
    },

  } as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    base,
    opencampus,
    arbitrum,
    morph
  ],
  ssr: true,
});
