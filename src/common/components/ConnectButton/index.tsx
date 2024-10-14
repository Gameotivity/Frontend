import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useConnect } from 'wagmi'
import { Button } from '../ui/button'
import { cn } from '@/common/styleUtils'
import { CoinbaseIcon } from '@/assets/svg/CoinbaseIcon'

const GRADIENT_BORDER_WIDTH = 2

const Gradient = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, style }, ref) => {
    return (
      <div ref={ref} className="relative">
        <div
          style={{
            background:
              'conic-gradient(from 180deg, #79dbd2, #45e1e5, #0052ff, #b82ea4, #ff9533, #7fd057)',
            ...style,
          }}
          className={cn(
            className,
            'group-hover:duration-2000 group-hover:ease-in-rotate group-hover:rotate-[720deg]',
          )}
        />
        {children}
      </div>
    )
  },
)

interface CreateWalletButtonProps {
  label: string
}

const CreateWalletButton = ({ label }: CreateWalletButtonProps) => {
  const { connectors, connect } = useConnect()

  const buttonRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (buttonRef.current) {
      setDimensions({
        width: buttonRef.current.offsetWidth,
        height: buttonRef.current.offsetHeight,
      })
    }
  }, [])

  const [gradientDiameter, setGradientDiameter] = useState(0)
  useLayoutEffect(() => {
    setGradientDiameter(Math.max(dimensions.height, dimensions.width))
  }, [dimensions])

  const styles = useMemo(
    () => ({
      gradientContainer: {
        borderRadius: dimensions.height / 2,
        height: dimensions.height,
        width: dimensions.width,
      },
      gradient: {
        height: gradientDiameter,
        width: gradientDiameter,
        top: -(gradientDiameter / 2) + dimensions.height / 2 - GRADIENT_BORDER_WIDTH,
        left: -GRADIENT_BORDER_WIDTH,
      },
      buttonBody: {
        height: dimensions.height - GRADIENT_BORDER_WIDTH * 2,
        width: dimensions.width - GRADIENT_BORDER_WIDTH * 2,
        borderRadius: dimensions.height / 2,
      },
    }),
    [dimensions, gradientDiameter],
  )

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === 'coinbaseWalletSDK',
    )
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector })
    }
  }, [connectors, connect])

  return (
    <Button
      variant="default"
      size="default"
      onClick={createWallet}
      className="border-1 box-border rounded-none border-solid border-transparent bg-transparent px-0 py-0 shadow-none"
    >
      <div
        style={styles.gradientContainer}
        className={cn(
          'group box-border flex items-center justify-center overflow-hidden bg-background',
        )}
      >
        <Gradient style={styles.gradient} className="absolute">
          <div
            ref={buttonRef}
            style={styles.buttonBody}
            className="relative box-border flex items-center justify-center gap-1 bg-background px-4 py-2 text-foreground"
          >
            <CoinbaseIcon className="h-6 w-6 fill-foreground" />
            {label}
          </div>
        </Gradient>
      </div>
    </Button>
  )
}

const ConnectButton = () => {
  const { t } = useTranslation()
  const { address } = useAccount()

  return (
    <div data-rk className="flex flex-row gap-2">
      {!address && <CreateWalletButton label={t('wallet:create')} />}
      <RainbowConnectButton label={t('wallet:connect')} />
    </div>
  )
}

export default ConnectButton
