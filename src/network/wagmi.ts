import { baseSepolia, sepolia } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'

// export const config = createConfig({
//   chains: [sepolia, baseSepolia],
//   connectors: [
//     injected(),
//     coinbaseWallet({ appName: 'Create Wagmi' }),
//     walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
//   ],
//   transports: {
//     [sepolia.id]: http(),
//   },
// })

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [sepolia, baseSepolia] as const
const config = defaultWagmiConfig({
  chains,
  projectId: import.meta.env.VITE_WC_PROJECT_ID!,
  metadata
})

createWeb3Modal({
  wagmiConfig: config,
  projectId: import.meta.env.VITE_WC_PROJECT_ID!,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

// declare module 'wagmi' {
//   interface Register {
//     config: typeof config
//   }
// }

export { config }
