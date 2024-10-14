import { Loading, Typography } from '@/common/components'

import { useTranslation } from 'react-i18next'
import CoinCard from '../components/CoinCard'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes'
import { ShrugIcon } from '@/assets/svg/ShrugIcon'
import { useTopTokens } from '@/client/queries/leaderboard'
import SEO from '@/common/components/SEO'

const Leaderboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: tokens } = useTopTokens()

  return (
    <>
      <SEO
        title={t('seo:leaderboard.title')}
        subtitle={t('seo:leaderboard.subtitle')}
        description={t('seo:leaderboard.description')}
      />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <aside className="w-fit justify-center space-y-4">
          <Typography variant="h3">{t('coin:leaderboard.title')}</Typography>

          {!tokens && (
            <div className="h-72 w-full">
              <Loading />
            </div>
          )}

          {tokens && (
            <div className="container m-auto grid auto-cols-max grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 ">
              {tokens.map((token) => (
                <div
                  className="w-fit rounded-md"
                  onClick={() =>
                    navigate({
                      pathname: APP_ROUTES.coinDetails.to(token.address),
                    })
                  }
                  key={token.address}
                >
                  <CoinCard showBorder token={token} />
                </div>
              ))}
            </div>
          )}
          {tokens !== undefined && tokens.length === 0 && (
            <ShrugIcon className="h-72 w-72 fill-muted-foreground" />
          )}
        </aside>
      </div>
    </>
  )
}

export default Leaderboard
