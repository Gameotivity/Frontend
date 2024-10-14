import { Loading, SEO, Typography } from '@/common/components'

import { useTranslation } from 'react-i18next'
import { useCoinDetailsParams } from '@/app/routes'
import { useAccount, useBalance } from 'wagmi'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/common/components/ui/tooltip'
import { truncateEthAddress } from '@/common/utils'

import { TelegramIcon } from '@/assets/svg/TelegramIcon'
import { TwitterIcon } from '@/assets/svg/TwitterIcon'
import { WebIcon } from '@/assets/svg/WebIcon'
import { LockIcon } from '@/assets/svg/LockIcon'
import { ClipboardIcon } from '@/assets/svg/ClipboardIcon'
import { WalletIcon } from '@/assets/svg/WalletIcon'
import { EthRoundIcon } from '@/assets/svg/EthRoundIcon'

import { toast } from 'sonner'

import { Theme, useTheme } from '@/app/providers/Theme'

import { useShowError } from '@/common/hooks/usePrintErrorMessage.js'
import { Button } from '@/common/components/ui/button'
import { Card } from '@/common/components/ui/card'
import { useToken, useTokenUsdAmount } from '@/client/queries/token'
import { usePool } from '@/client/queries/pool'
import { useDexData } from '@/client/queries/dex'
import { useEthUsdAmount } from '@/client/queries/eth'
import { useEffect, useState } from 'react'
import { useAddTokenToWallet, useClaimFees } from '@/client/mutations/token'
import { formatUnits } from 'viem'
import Swap from '../components/Swap'
import { useIsSupportedChain } from '@/app/providers/Wallet'

const CoinDetails = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const showError = useShowError()

  const { coinId } = useCoinDetailsParams()

  const account = useAccount()
  const isSupportedChain = useIsSupportedChain()

  const { data: token, isLoading: isTokenLoading } = useToken(coinId)
  const { data: pool, refetch: refetchPool } = usePool(coinId)
  const { data: dexData, refetch: refetchDexData } = useDexData(coinId)
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: account.address,
    token: coinId,
  })

  const { data: ethPrice } = useEthUsdAmount(1)
  const { data: tokenPrice } = useTokenUsdAmount(coinId, 1000)

  const [tokenFees, setTokenFees] = useState<number>()
  const [ethFees, setEthFees] = useState<number>()

  const { mutate: addToWallet } = useAddTokenToWallet({
    onError: () => showError(t('global:addFailed', { token: token?.name })),
    onSuccess: () => {
      toast.success(t('global:added', { token: token?.name }))
    },
  })

  useEffect(() => {
    if (pool) {
      if (pool.token0 === coinId) {
        setTokenFees(pool.fees.token0)
        setEthFees(pool.fees.token1)
      } else {
        setTokenFees(pool.fees.token1)
        setEthFees(pool.fees.token0)
      }
    }
  }, [pool, coinId])

  const { mutate: claimFees, isPending: isClaimingFees } = useClaimFees({
    onSuccess: () => {
      toast.success(t('coin:misc.claimSuccess'))
      refetchPool()
      refetchDexData()
      refetchBalance()
    },
    onError: () => {
      toast.error(t('coin:misc.claimError'))
    },
  })

  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })

  return (
    <>
      <SEO
        title={t('seo:coin.title', { name: token?.name })}
        subtitle={t('seo:coin.subtitle', { name: token?.name })}
        description={t('seo:coin.description', { name: token?.name })}
        image={token?.avatar}
        frame={`coins/${coinId}`}
      />
      <div className="flex h-full w-full flex-col items-center xl:flex-row xl:items-start">
        {isTokenLoading ? (
          <div className="h-fit min-w-80 flex-col gap-4 ">
            <Loading />
          </div>
        ) : (
          <div className="flex h-fit w-96 flex-col gap-4 pb-6 xl:pb-0">
            <div className=" flex w-96 flex-row items-center gap-4 rounded-md bg-card px-6 py-4 text-card-foreground ">
              <div className="flex w-48 flex-col gap-2">
                <Typography variant="regularText">{token?.name}</Typography>
                <Typography variant="mutedText">{token?.symbol}</Typography>
                <div className="flex flex-row gap-1">
                  {token?.metadata?.telegram && (
                    <a
                      className="transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                      href={`https://t.me/${token.metadata.telegram.substring(1)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TelegramIcon className="h-6 w-6" />
                    </a>
                  )}
                  {token?.metadata?.twitter && (
                    <a
                      className="transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                      href={`https://twitter.com/${token.metadata.twitter.substring(1)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TwitterIcon className="h-6 w-6" />
                    </a>
                  )}
                  {token?.metadata?.website && (
                    <a
                      className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                      href={token.metadata.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WebIcon className="h-6 w-6 fill-foreground" />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex ">
                <img
                  className="aspect-square h-32 w-32 rounded-lg object-cover shadow-lg shadow-primary"
                  src={token?.avatar}
                  alt={token?.name}
                />
              </div>
            </div>
            <div className="flex w-96 flex-col gap-4 rounded-md bg-card px-6 text-card-foreground">
              {token && (
                <>
                  <Typography variant="regularText">{token.description}</Typography>
                  <div className="flex flex-row items-center gap-2">
                    <Typography variant="regularText">
                      {t('coin:metadata.totalSupply.label')}
                    </Typography>
                    <div className="grow"></div>
                    <Typography variant="mutedText">
                      {token.totalSupply.toLocaleString()}
                    </Typography>
                  </div>
                  {balance && (
                    <div className="flex flex-row items-center gap-2">
                      <Typography variant="regularText">
                        {t('coin:metadata.balance.label')}
                      </Typography>
                      <div className="grow"></div>
                      <Typography variant="mutedText">
                        {Number(formatUnits(balance.value, balance.decimals)).toLocaleString()}
                      </Typography>
                    </div>
                  )}
                  {dexData && (
                    <>
                      {dexData.liquidity !== undefined && dexData.liquidity !== 0 && (
                        <div className="flex flex-row items-center gap-0">
                          <Typography variant="regularText">
                            {t('coin:metadata.liquidity.label')}
                          </Typography>
                          <div className="grow"></div>
                          <Typography variant="mutedText">
                            {`$${formatter.format(dexData.liquidity)}`}
                          </Typography>
                          <LockIcon className="h-3.5 w-3.5 fill-muted-foreground" />
                        </div>
                      )}
                      {dexData.marketCap !== undefined && dexData.marketCap !== 0 && (
                        <div className="flex flex-row items-center gap-2">
                          <Typography variant="regularText">
                            {t('coin:metadata.marketCap.label')}
                          </Typography>
                          <div className="grow"></div>
                          <Typography variant="mutedText">
                            {`$${formatter.format(dexData.marketCap)}`}
                          </Typography>
                        </div>
                      )}
                      {dexData?.volume?.h24 !== undefined && dexData?.volume?.h24 !== null && (
                        <div className="flex flex-row items-center gap-1">
                          <Typography variant="regularText">
                            {t('coin:metadata.volume.label')}
                          </Typography>
                          <div className="grow"></div>
                          <Typography variant="mutedText">
                            {`$${formatter.format(dexData.volume.h24)}`}
                          </Typography>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex flex-row items-center gap-1">
                    {token.symbol}
                    <div className="grow"></div>
                    <a
                      href={`https://base.blockscout.com/address/${coinId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Typography variant="mutedText">{truncateEthAddress(coinId)}</Typography>
                    </a>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger>
                        <button
                          data-tooltip-target="tooltip-click"
                          data-tooltip-trigger="click"
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                          onClick={() => {
                            navigator.clipboard.writeText(coinId)
                            toast.success(t('global:copied', { token: token.name }))
                          }}
                        >
                          <ClipboardIcon className="h-4 w-4 fill-primary-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{t('global:copy')}</TooltipContent>
                    </Tooltip>
                    {token && (
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                          <button
                            data-tooltip-target="tooltip-click"
                            data-tooltip-trigger="click"
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                            onClick={() =>
                              addToWallet({
                                address: coinId,
                                symbol: token.symbol,
                                decimals: token.decimals,
                                image: token.avatar,
                              })
                            }
                          >
                            <WalletIcon className="h-4 w-4 fill-primary-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>{t('global:wallet')}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {pool && (
                    <div className="flex flex-row items-center gap-2">
                      {t('coin:metadata.pair.label')}
                      <div className="grow"></div>
                      <a
                        href={`https://base.blockscout.com/address/${pool.address}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Typography variant="mutedText">
                          {truncateEthAddress(pool.address)}
                        </Typography>
                      </a>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                          <button
                            data-tooltip-target="tooltip-click"
                            data-tooltip-trigger="click"
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                            onClick={() => {
                              navigator.clipboard.writeText(pool.address)
                              toast.success(t('global:copied', { token: 'Pair' }))
                            }}
                          >
                            <ClipboardIcon className="h-4 w-4 fill-primary-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>{t('global:copy')}</TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </>
              )}
            </div>
            {pool && pool.owner === account.address && (
              <div className="flex w-96 flex-col gap-4 rounded-md bg-card px-6 text-card-foreground">
                <Card className="p-2">
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-row items-center gap-2">
                      <EthRoundIcon className="h-6 w-6" />
                      <Typography variant="mutedText">ETH</Typography>
                      <div className="grow"></div>
                      <Typography variant="mutedText">
                        {ethFees !== undefined && ethFees.toFixed(3)}
                        {ethFees !== undefined &&
                          ethPrice &&
                          ` ($${formatter.format(ethPrice * ethFees)})`}
                      </Typography>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <img
                        className="aspect-square h-6 w-6 rounded-full object-cover"
                        src={token?.avatar}
                        alt={token?.name}
                      />
                      <Typography variant="mutedText">{token?.symbol}</Typography>
                      <div className="grow"></div>
                      <Typography variant="mutedText">
                        {tokenFees !== undefined && formatter.format(tokenFees)}
                        {tokenFees !== undefined &&
                          ` ($${formatter.format((tokenPrice || 0) * (tokenFees / 1000))})`}
                      </Typography>
                    </div>
                  </div>
                </Card>
                <Button
                  variant="default"
                  size="default"
                  loading={isClaimingFees}
                  disabled={
                    !pool.positionId ||
                    !account?.address ||
                    (!ethFees && !tokenFees) ||
                    isClaimingFees ||
                    !isSupportedChain
                  }
                  onClick={() => {
                    claimFees({
                      positionId: pool.positionId,
                      recipient: account!.address!!,
                    })
                  }}
                >
                  {isClaimingFees ? t('coin:misc.claiming') : t('coin:misc.claimFees')}
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="flex h-[80dvh] w-full flex-row items-center ">
          <div className="h-full w-full ">
            {pool && (
              <iframe
                title={`${token?.name} Price Chart`}
                className="h-full w-full"
                src={`https://www.dextools.io/widget-chart/en/base/pe-light/${pool.address}?theme=${theme}&chartType=1&chartResolution=15&drawingToolbars=false&headerColor=${theme === Theme.DARK ? '141414' : 'FFFFFF'}&tvPlatformColor=${theme === Theme.DARK ? '141414' : 'FFFFFF'}&tvPaneColor=${theme === Theme.DARK ? '141414' : 'FFFFFF'}`}
              ></iframe>
            )}
            {!pool && <Loading />}
          </div>
        </div>
        <div className="flex h-fit w-96 flex-row justify-center px-4 ">
          {token && (
            <Swap
              token={token}
              onSwap={() => {
                refetchBalance()
                refetchDexData()
                refetchPool()
              }}
            />
          )}
          {!token && (
            <div className="h-full w-96">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CoinDetails
