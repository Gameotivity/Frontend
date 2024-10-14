import { useTranslation } from 'react-i18next'

import { Typography } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes'
import { useTopTokens } from '@/client/queries/leaderboard'
import { BaseIcon } from '@/assets/svg/BaseIcon'
import CoinCardMax from '../components/CoinCardMax'
import CoinCard from '../components/CoinCard'
import { CrownIcon } from '@/assets/svg/CrownIcon'

const Landing = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: tokens } = useTopTokens()

  return (
    <div className="flex flex-col items-center justify-center gap-36 2xl:scale-125 3xl:scale-150 4xl:scale-200">
      <div className="m-auto grid auto-cols-max grid-cols-1 gap-24 lg:grid-cols-3 xl:grid-cols-6 xl:px-12 ">
        <div className="flex h-full grow flex-col items-center justify-center gap-y-6 pt-0 lg:col-span-2 lg:pt-16 xl:col-span-4 xl:pt-24">
          <Typography
            variant="h1"
            className="text-balance leading-tight lg:text-6xl xl:text-left xl:text-7xl"
          >
            {t('landing:message.title')}
            <BaseIcon
              className="mx-2 -mt-1 inline-flex h-10 w-10 items-center  lg:-mt-2 xl:mx-3 xl:-mt-4 xl:h-16 xl:w-16 "
              title={`${t('landing:message.title')} ${t('landing:message.baseTitle')}`}
            />
            <span className="text-primary">{t('landing:message.baseTitle')}</span>
          </Typography>
          <div className="lg-grid-cols-1 grid items-center justify-center gap-y-8 xl:grid-cols-3 xl:gap-10">
            <Typography variant="h3" className="text-balance xl:col-span-2 xl:text-left">
              {t('landing:message.subtitle')}
            </Typography>
            <Button
              variant="default"
              size="xl"
              disabled={false}
              className="w-fit place-self-center self-center xl:row-start-1"
              onClick={() => {
                navigate({
                  pathname: APP_ROUTES.newCoin.to,
                })
              }}
            >
              {t('landing:action.start.text')}
            </Button>
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center xl:col-span-2">
          {tokens && tokens.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <Typography
                variant="h3"
                className="justify-center text-balance xl:col-span-2 xl:text-left"
              >
                {t('landing:topCoin.title')}
                <CrownIcon className="mx-2 -mt-1 inline-flex h-6 w-6 items-center fill-primary" />
              </Typography>
              <div
                className="w-fit"
                onClick={() =>
                  navigate({
                    pathname: APP_ROUTES.coinDetails.to(tokens[0]!!.address),
                  })
                }
                key={tokens[0]!!.address}
              >
                <CoinCardMax token={tokens[0]!!} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-12 ">
        {tokens && (
          <Typography variant="h2" className="font-bold text-primary">
            {t('coin:leaderboard.title')}
          </Typography>
        )}
        {tokens && (
          <div className="container m-auto grid auto-cols-max grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 ">
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
      </div>
    </div>
  )
}

export default Landing
