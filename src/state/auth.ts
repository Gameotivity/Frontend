import { useMemo } from 'react'
import { useAccount } from 'wagmi'

interface AuthState {
  userAddress?: string
  isLoggedIn: boolean
}

export const useAuthState = () => {
  const { address } = useAccount()
  return useMemo(
    () => [{ userAddress: address, isLoggedIn: address !== undefined } as AuthState] as const,
    [address],
  )
}
