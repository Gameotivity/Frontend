import { Typography } from '@/common/components'
import { cn } from '@/common/styleUtils'
import { TelegramIcon } from '@/assets/svg/TelegramIcon'
import { TwitterIcon } from '@/assets/svg/TwitterIcon'
import { WebIcon } from '@/assets/svg/WebIcon'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'

interface Token {
  address: `0x${string}`
  name: string
  symbol: string
  marketCap?: number
  rank?: number
  avatar?: string
  description?: string
  metadata?: {
    twitter?: string
    telegram?: string
    website?: string
  }
}

interface CoinCardProps {
  token: Token
  showBorder?: boolean
}

const CoinCard = ({ token, showBorder = false }: CoinCardProps) => {
  const { t } = useTranslation()

  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })

  return (
    <div
      className={cn(
        'flex w-80 cursor-pointer flex-row items-center gap-4 rounded-md bg-card px-5 py-5 text-card-foreground transition duration-300 ease-in-out hover:rounded-md hover:shadow-lg hover:shadow-primary hover:outline-none hover:ring-2 hover:ring-ring',
        showBorder && 'border',
      )}
    >
      <div className="group relative flex w-full flex-row items-center">
        {token.rank && (
          <Typography
            variant="regularText"
            className="absolute -left-4 -top-5 text-xl text-primary"
          >
            {`#${token.rank}`}
          </Typography>
        )}
        <div className="flex w-32 flex-col gap-2">
          <Typography variant="regularText">{token.name}</Typography>
          <Typography variant="mutedText">{token.symbol}</Typography>
          <div className="flex flex-row gap-1">
            {token?.metadata?.telegram && (
              <a
                className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                href={`https://t.me/${token.metadata.telegram.substring(1)}`}
                target="_blank"
                rel="noreferrer"
              >
                <TelegramIcon className="h-6 w-6" />
              </a>
            )}
            {token?.metadata?.twitter && (
              <a
                className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
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
          {token?.marketCap !== undefined && (
            <div className="flex flex-row items-center gap-2 group-hover:animate-bounce">
              <Typography variant="regularText" className="text-xs text-primary">
                {t('coin:metadata.marketCap.label')}
              </Typography>
              <Typography variant="mutedText" className="text-xs text-primary">
                {`$${formatter.format(token.marketCap)}`}
              </Typography>
            </div>
          )}
        </div>
        <div className="grow"></div>
        <div className="flex h-32 w-32 items-center justify-center">
          {token?.avatar === undefined ? (
            <Loader2 className="size-4 animate-spin " />
          ) : (
            <img
              className="aspect-square h-full w-full rounded-lg object-cover shadow-lg shadow-primary group-hover:animate-shake group-hover:transition group-hover:duration-700"
              src={token.avatar}
              alt={token.name}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CoinCard
