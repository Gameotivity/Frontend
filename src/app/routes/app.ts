import { generatePath, useParams } from 'react-router-dom'

export const APP_ROUTES = {
  index: {
    path: '*',
    to: '/',
    absPath: '/',
  },
  coins: {
    path: 'coins',
    to: '/coins',
    absPath: '/coins',
  },
  leaderboard: {
    path: 'top',
    to: '/top',
    absPath: '/top',
  },
  newCoin: {
    path: 'coins/create',
    to: '/coins/create',
    absPath: '/coins/create',
  },
  coinDetails: {
    path: '/coins/:coinId',
    to: (coinId: string) => generatePath('/coins/:coinId', { coinId }),
    absPath: '/coins/:coinId',
  },
  faq: {
    path: 'faq',
    to: '/faq',
    absPath: '/faq',
  },
  tos: {
    path: 'tos',
    to: '/tos',
    absPath: '/tos',
  },
} as const satisfies Record<
  string,
  {
    path: string
    to: string | ((...args: string[]) => string)
    absPath: string
  }
>

export const useCoinDetailsParams = () => {
  const { coinId } = useParams<{ coinId: `0x${string}` }>()
  if (!coinId) {
    throw new Error('Missing coinId parameter')
  }
  return { coinId }
}
