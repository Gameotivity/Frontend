import { Suspense } from 'react'

import { Loading } from '@/common/components'
import { Toaster } from '@/common/components/ui/sonner'
import { TooltipProvider } from '@/common/components/ui/tooltip'

import ThemeProvider from './providers/Theme'
import Jotai from './providers/Jotai'
import Query from './providers/Query'
import Router from './providers/Router'
import GlobalErrorBoundary from './GlobalErrorBoundary'
import App from './App'
import QueryParamsProvider from './providers/QueryParams'

import '@rainbow-me/rainbowkit/styles.css'
import WalletProvider from './providers/Wallet'
import Analytics from './providers/Analytics'
import SEOProvider from './providers/SEO'

const Root = () => (
  <GlobalErrorBoundary>
    <SEOProvider>
      <TailwindIndicator />
      <Analytics />
      <Jotai>
        <Suspense fallback={<Loading />}>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Query>
                <Router>
                  <QueryParamsProvider>
                    <WalletProvider>
                      <App />
                    </WalletProvider>
                  </QueryParamsProvider>
                </Router>
              </Query>
            </TooltipProvider>
          </ThemeProvider>
        </Suspense>
      </Jotai>
    </SEOProvider>
  </GlobalErrorBoundary>
)

export default Root

const TailwindIndicator = () =>
  import.meta.env.PROD ? null : (
    <div className="font-mono fixed bottom-3 left-24 z-50 flex size-14 items-center justify-center rounded-full bg-gray-800 text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="3xl:hidden hidden 2xl:block">2xl</div>
      <div className="3xl:block 4xl:hidden hidden">3xl</div>
      <div className="4xl:block hidden">4xl</div>
    </div>
  )
