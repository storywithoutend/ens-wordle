/**
 * wagmi configuration for ENS-Wordle
 * Read-only setup for ENS data fetching
 */

import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { createPublicClient } from 'viem';

// Create wagmi config for ENS operations
export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// Create public client for direct viem operations
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// RPC endpoint configuration with fallbacks
export const RPC_ENDPOINTS = [
  'https://eth-mainnet.g.alchemy.com/v2/demo', // Demo key for development
  'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', // Public Infura endpoint
  'https://cloudflare-eth.com', // Cloudflare public endpoint
  'https://ethereum.publicnode.com', // Public node
];

// Timeout configuration
export const ENS_CONFIG = {
  AVATAR_TIMEOUT: 3000, // 3 seconds
  RESOLUTION_TIMEOUT: 5000, // 5 seconds
  MAX_RETRIES: 2,
} as const;
