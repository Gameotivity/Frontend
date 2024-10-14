import { useAuthState } from '@/state/auth'

import { useConnectModal } from '@rainbow-me/rainbowkit'

export { default as RequireIsAnonymous } from './RequireIsAnonymous'
export { default as RequireIsLoggedIn } from './RequireIsLoggedIn'

export const useAuth = () => useAuthState()[0]

export const useSignIn = useConnectModal
