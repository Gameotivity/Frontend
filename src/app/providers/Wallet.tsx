import { useMemo, type ReactNode } from 'react'

import {
  DisclaimerComponent,
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  cssStringFromTheme,
} from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  rabbyWallet,
  metaMaskWallet,
  rainbowWallet,
  zerionWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider, http, useAccount } from 'wagmi'
import { base } from 'wagmi/chains'
import { defineChain } from 'viem'

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{' '}
    <Link href="https://fomofactory.wtf/tos">Terms of Service</Link> and acknowledge you have read
    and understand how FomoFactory <Link href="https://fomofactory.wtf/faq">works</Link>
  </Text>
)

interface Props {
  children: ReactNode
}

const WalletProvider = ({ children }: Props) => {
  // Enable Coinbase Smart Wallet
  coinbaseWallet.preference = 'all'

  const baseWithEns = defineChain({
    ...base,
    contracts: {
      ...base.contracts,
      ensRegistry: {
        address: import.meta.env[`VITE_ENS_REGISTRY_ADDRESS_${base.id}`],
      },
    },
  })

  const config = getDefaultConfig({
    appName: import.meta.env.VITE_APP_NAME,
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    chains: [baseWithEns],
    transports: {
      [baseWithEns.id]: http(import.meta.env.VITE_RPC_PROVIDER_URL),
    },
    wallets: [
      {
        groupName: 'Recommended',
        wallets: [
          coinbaseWallet,
          zerionWallet,
          rabbyWallet,
          metaMaskWallet,
          rainbowWallet,
          walletConnectWallet,
        ],
      },
    ],
    ssr: import.meta.env.SSR,
  })

  const light = lightTheme({
    accentColor: '#0050FF',
    accentColorForeground: '#f5f5f5',
    overlayBlur: 'none',
  })
  const dark = darkTheme({
    accentColor: '#0050FF',
    accentColorForeground: '#f5f5f5',
    overlayBlur: 'none',
  })

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        modalSize="compact"
        locale="en"
        theme={null}
        appInfo={{
          learnMoreUrl: 'https://fomofactory.wtf/faq',
          disclaimer: Disclaimer,
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                ${cssStringFromTheme({ ...light, radii: { ...light.radii, connectButton: '9999px', menuButton: '9999px' } })}
              }
  
              .dark {
                ${cssStringFromTheme(dark, {
                  extends: light,
                })}
              }
            `,
          }}
        />
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  )
}

export const useIsSupportedChain = () => {
  const { chainId } = useAccount()
  return useMemo(() => chainId === base.id, [chainId])
}

export default WalletProvider
