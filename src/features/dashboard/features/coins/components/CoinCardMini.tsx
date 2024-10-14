import { Typography } from '@/common/components'
import { cn } from '@/common/styleUtils'
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

interface CoinCardMiniProps {
  token: Token
  showBorder?: boolean
}

const CoinCardMini = ({ token, showBorder = false }: CoinCardMiniProps) => {
  const { t } = useTranslation()

  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })

  return (
    <div
      className={cn(
        'flex w-fit cursor-pointer flex-row items-center rounded-md bg-card text-card-foreground transition duration-300 ease-in-out',
        showBorder && 'border',
      )}
    >
      <div className="group flex w-full flex-row items-center gap-2">
        {token.rank && (
          <Typography variant="regularText" className="text-sm text-primary">
            {`#${token.rank}`}
          </Typography>
        )}
        <div className="flex h-5 w-5 items-center justify-center">
          {token?.avatar === undefined ? (
            <Loader2 className="size-4 animate-spin " />
          ) : (
            <img
              className="aspect-square h-full w-full rounded-lg object-cover group-hover:animate-shake group-hover:transition group-hover:duration-700"
              src={token.avatar}
              title={token.name}
              alt={token.name}
            />
          )}
        </div>
        <Typography variant="regularText" className="text-sm">
          {token.symbol}
        </Typography>
        {token?.marketCap !== undefined && (
          <div className="flex flex-row items-center gap-2">
            <Typography variant="regularText" className="text-sm text-primary">
              {t('coin:metadata.marketCapMini.label')}
            </Typography>
            <Typography variant="mutedText" className="text-sm text-primary">
              {`$${formatter.format(token.marketCap)}`}
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoinCardMini
