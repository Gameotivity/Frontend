import { useTheme, Theme } from '@/app/providers/Theme'
import { useEthersSigner } from '@/common/utils/ethers'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import {
  darkTheme,
  DialogAnimationType,
  lightTheme,
  SwapWidget,
  SwapWidgetProps,
  SwapWidgetSkeleton,
} from '@uniswap/widgets'
import { useEffect } from 'react'

import { useAccount, useConfig } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { useIsSupportedChain } from '@/app/providers/Wallet'

interface Token {
  address: `0x${string}`
  name: string
  symbol: string
  decimals: number
  avatar?: string
}

interface Props {
  token: Token
  onSwap?: () => void
}

const Swap = ({ token, onSwap }: Props) => {
  const { theme } = useTheme()

  const { openConnectModal } = useConnectModal()
  const account = useAccount()
  const signer = useEthersSigner()
  const config = useConfig()
  const isSupportedChain = useIsSupportedChain()

  // hack to fix uniswap widget
  useEffect(() => {
    ;(window as any).Browser = {
      T: () => {},
    }
  }, [])

  const fontFamily = [
    'SFRounded',
    'ui-rounded',
    'SF Pro Rounded',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
  ]
  const borderRadius = { large: 1, medium: 10, small: 0.5, xsmall: 0.375 }

  const lightWidgetTheme = {
    ...lightTheme,
    fontFamily: fontFamily.join(','),
    borderRadius,
    zIndex: { modal: 100 },
    container: 'hsl(0,0%,100%)',
    dialog: 'hsl(0,0%,100%)',
    module: 'hsl(0,0%,100%)',
    outline: 'hsl(0,0%,89.8%)',
    border: 'hsl(0,0%,100%)',
    accent: 'hsl(221,100%,50%)',
    onAccent: 'hsl(0,0%,100%)',
    interactive: 'hsl(0,0%,96.1%)',
    action: 'hsl(221,100%,50%)',
    onAction: 'hsl(0,0%,100%)',
    onInteractive: 'hsl(0,0%,30.1%)',
    focus: 'hsl(221,100%,50%)',
    primary: 'hsl(0,0%,9%)',
    secondary: 'hsl(0,0%,65%)',
    deepShadow: 'hsl(0,0%,100%)',
    networkDefaultShadow: 'hsl(0,0%,100%)',
  }
  const darkWidgetTheme = {
    ...darkTheme,
    fontFamily: fontFamily.join(','),
    borderRadius,
    zIndex: { modal: 100 },
    container: 'hsl(0,0%,8%)',
    dialog: 'hsl(0,0%,8%)',
    module: 'hsl(0,0%,8%)',
    outline: 'hsl(0,0%,14.9%)',
    border: 'hsl(0,0%,8%)',
    accent: 'hsl(221,100%,50%)',
    onAccent: 'hsl(0,0%,100%)',
    interactive: 'hsl(0,0%,14.9%)',
    action: 'hsl(221,100%,50%)',
    onAction: 'hsl(0,0%,100%)',
    onInteractive: 'hsl(0,0%,63.9%)',
    focus: 'hsl(221,100%,50%)',
    primary: 'hsl(0,0%,98%)',
    secondary: 'hsl(0,0%,35%)',
    deepShadow: 'hsl(0,0%,8%)',
    networkDefaultShadow: 'hsl(0,0%,8%)',
  }

  const widgetConfig: SwapWidgetProps = {
    hideConnectionUI: true,
    provider: signer?.provider || null,
    onConnectWalletClick: () => {
      openConnectModal!()
      return false
    },
    onSwapSend: async (_, transaction) => {
      const tx = await transaction
      await waitForTransactionReceipt(config, {
        hash: tx.response.hash as `0x${string}`,
      })
      if (onSwap) onSwap()
    },
    theme: theme === Theme.LIGHT ? lightWidgetTheme : darkWidgetTheme,
    dialogOptions: {
      animationType: DialogAnimationType.FADE,
    },
    defaultInputTokenAddress: 'NATIVE',
    defaultOutputTokenAddress: token.address,
    disableTokenSelection: true,
    brandedFooter: false,
    permit2: true,
  }

  return (
    <>
      {token && account.address && account.chainId && isSupportedChain ? (
        <SwapWidget
          className="h-max"
          {...widgetConfig}
          tokenList={[
            {
              name: token.name,
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              chainId: account.chainId,
              logoURI: token.avatar,
            },
          ]}
        />
      ) : (
        <SwapWidgetSkeleton theme={widgetConfig.theme} />
      )}
    </>
  )
}

export default Swap
