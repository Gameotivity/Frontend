import { useQuery } from '@tanstack/react-query'

import { readContract } from '@wagmi/core'
import { maxUint256 } from 'viem'
import { Config, useChainId, useConfig } from 'wagmi'

import { fetchTokensDexData } from './dex'
import { fomoFactoryAbi } from '../abi/generated'
import { fetchTokensData } from './token'

const fetchTopTokens = async (config: Config, chainId: number) => {
  try {
    console.log(
      'fomo factor address from leaderboard.ts:',
      import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    )

    const tokens = await readContract(config, {
      address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
      abi: fomoFactoryAbi,
      functionName: 'queryMemecoins',
      args: [0n, maxUint256, false],
    })

    console.log('result:', tokens)

    const tokensData = await fetchTokensData(config, tokens as `0x${string}`[])
    const tokensDataMap = new Map(tokensData.map((token) => [token.address, token]))

    const dexData = (await fetchTokensDexData(config, chainId, tokens as `0x${string}`[]))
      .filter((token) => token.marketCap)
      .map((token) => {
        return {
          ...tokensDataMap.get(token.address)!!,
          ...token,
        }
      })

    const dexDataSorted = dexData.sort((t1, t2) => t2.marketCap!! - t1.marketCap!!)
    const temp = dexDataSorted.map((token, idx) => {
      return { rank: idx + 1, ...token }
    })
    console.log('final result:', temp)
    return
  } catch (error: any) {
    console.error('An error of toptoken:', error)
  }
  return
}

export const useTopTokens = () => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['topTokens', { chainId }],
    queryFn: () => fetchTopTokens(config, chainId),
  })
}
