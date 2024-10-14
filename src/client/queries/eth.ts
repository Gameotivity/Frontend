import { useQuery } from '@tanstack/react-query'

import { multicall } from '@wagmi/core'
import { Config, useChainId, useConfig } from 'wagmi'
import { formatUnits } from 'viem'
import { aggregatorV3InterfaceAbi } from '../abi/generated'

export const fetchUsdEthAmount = async (config: Config, chainId: number, usdAmount: number) => {
  const [latestRoundData, decimals] = await multicall(config, {
    allowFailure: false,
    contracts: [
      {
        address: import.meta.env[`VITE_ETH_USD_AGGREGATOR_ADDRESS_${chainId}`],
        abi: aggregatorV3InterfaceAbi,
        functionName: 'latestRoundData',
      },
      {
        address: import.meta.env[`VITE_ETH_USD_AGGREGATOR_ADDRESS_${chainId}`],
        abi: aggregatorV3InterfaceAbi,
        functionName: 'decimals',
      },
    ],
  })

  const ethPrice = Number(formatUnits(latestRoundData[1], decimals))
  return usdAmount / ethPrice
}

export const useUsdEthAmount = (usdAmount: number) => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['usdEthAmount', { usdAmount, chainId }],
    queryFn: () => fetchUsdEthAmount(config, chainId, usdAmount),
  })
}

export const fetchEthUsdAmount = async (config: Config, chainId: number, ethAmount: number) => {
  const [latestRoundData, decimals] = await multicall(config, {
    allowFailure: false,
    contracts: [
      {
        address: import.meta.env[`VITE_ETH_USD_AGGREGATOR_ADDRESS_${chainId}`],
        abi: aggregatorV3InterfaceAbi,
        functionName: 'latestRoundData',
      },
      {
        address: import.meta.env[`VITE_ETH_USD_AGGREGATOR_ADDRESS_${chainId}`],
        abi: aggregatorV3InterfaceAbi,
        functionName: 'decimals',
      },
    ],
  })

  const ethPrice = Number(formatUnits(latestRoundData[1], decimals))
  return ethAmount * ethPrice
}

export const useEthUsdAmount = (ethAmount: number) => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['ethUsdAmount', { ethAmount, chainId }],
    queryFn: () => fetchEthUsdAmount(config, chainId, ethAmount),
  })
}
