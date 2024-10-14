import { ReactElement, Suspense, useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'

import { Loading, Layout } from '@/common/components'
import ConnectButton from '@/common/components/ConnectButton'
import { InfiniteMovingCards } from '@/common/components/ui/infinite-moving-cards'
import { APP_ROUTES } from '@/app/routes/app'
import { useAuth } from '@/common/auth'
import NewCoin from './features/coins/pages/NewCoin'
import CoinDetails from './features/coins/pages/CoinDetails'
import MyCoins from './features/coins/pages/MyCoins'
import FAQ from './features/coins/pages/FAQ'
import { useTranslation } from 'react-i18next'
import Terms from '@/common/components/Terms'
import Landing from './features/coins/pages/Landing'
import Leaderboard from './features/coins/pages/Leaderboard'
import preview from '@/assets/png/preview.png'
import SEO from '@/common/components/SEO'
import CoinCardMini from './features/coins/components/CoinCardMini'
import { useTopTokens } from '@/client/queries/leaderboard'

const Dashboard = () => {
  const { isLoggedIn } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: tokens } = useTopTokens()
  const [cards, setCards] = useState<ReactElement[]>([])

  useEffect(() => {
    if (tokens) {
      var t = tokens
      while (t.length < 10) {
        t = t.concat(tokens)
      }
      t = t.slice(0, 10)
      setCards(
        t.map((token, tIdx) => (
          <div
            className="mx-6 w-fit"
            onClick={() =>
              navigate({
                pathname: APP_ROUTES.coinDetails.to(token.address),
              })
            }
            key={`${token.address}-${tIdx}`}
          >
            <CoinCardMini showBorder={false} token={token} />
          </div>
        )),
      )
    }
  }, [tokens, navigate])

  return (
    <>
      <SEO
        title={t('seo:root.title')}
        subtitle={t('seo:root.subtitle')}
        description={t('seo:root.description')}
        image={preview}
        siteName={t('seo:root.siteName')}
        frame=""
      />
      <Routes>
        <Route
          element={
            <Layout
              headerProps={{
                baseUrl: APP_ROUTES.index.to,
                links: [
                  ...[{ to: APP_ROUTES.newCoin.to, label: t('dashboard:header.newCoin') }],
                  ...[{ to: APP_ROUTES.leaderboard.to, label: t('dashboard:header.leaderboard') }],
                  ...(isLoggedIn
                    ? [{ to: APP_ROUTES.coins.to, label: t('dashboard:header.myCoins') }]
                    : []),
                  ...[{ to: APP_ROUTES.faq.to, label: t('dashboard:header.faq') }],
                ],
                endSlot: (
                  <>
                    <ConnectButton />
                  </>
                ),
                topContent: (
                  <div className="flex w-dvw flex-col items-center justify-center overflow-hidden pt-1 antialiased">
                    <InfiniteMovingCards direction="left" speed="normal">
                      {cards}
                    </InfiniteMovingCards>
                  </div>
                ),
              }}
            >
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </Layout>
          }
        >
          <Route index element={<Landing />} />
          <Route path={APP_ROUTES.coins.path} element={<MyCoins />} />
          <Route path={APP_ROUTES.coinDetails.path} element={<CoinDetails />} />
          <Route path={APP_ROUTES.newCoin.path} element={<NewCoin />} />
          <Route path={APP_ROUTES.faq.path} element={<FAQ />} />
          <Route path={APP_ROUTES.tos.path} element={<Terms />} />
          <Route path={APP_ROUTES.leaderboard.path} element={<Leaderboard />} />
          <Route path="*" element={<Navigate replace to={APP_ROUTES.index.to} />} />
        </Route>
      </Routes>
    </>
  )
}

export default Dashboard
