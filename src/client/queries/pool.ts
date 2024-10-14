import { Pool } from '../models/pool'

import { useQuery } from '@tanstack/react-query'

import { readContract, multicall } from '@wagmi/core'
import { formatEther, maxUint128, PublicClient } from 'viem'
import { Config, useChainId, useConfig, usePublicClient } from 'wagmi'
import {
  fomoFactoryAbi,
  iNonfungiblePositionManagerAbi,
  iUniswapV3PoolAbi,
  liquidityLockerAbi,
} from '../abi/generated'

const fetchPool = async (
  client: PublicClient | undefined,
  config: Config,
  chainId: number,
  tokenAddress: `0x${string}`,
) => {
  if (!client) throw new Error('Failed to initialize client')

  const [address, positionId] = await readContract(config, {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: fomoFactoryAbi,
    functionName: 'poolMetadataOf',
    args: [tokenAddress],
  })

  const [owner, token0, token1] = await multicall(config, {
    allowFailure: false,
    contracts: [
      {
        address: import.meta.env[`VITE_LIQUIDITY_LOCKER_ADDRESS_${chainId}`],
        abi: liquidityLockerAbi,
        functionName: 'ownerOf',
        args: [positionId],
      },
      {
        address: address,
        abi: iUniswapV3PoolAbi,
        functionName: 'token0',
      },
      {
        address: address,
        abi: iUniswapV3PoolAbi,
        functionName: 'token1',
      },
    ],
  })

  const fees = await client.simulateContract({
    address: import.meta.env[`VITE_UNISWAP_V3_NONFUNGIBLE_POSITION_MANAGER_ADDRESS_${chainId}`],
    abi: iNonfungiblePositionManagerAbi,
    functionName: 'collect',
    args: [
      {
        tokenId: positionId,
        recipient: address,
        amount0Max: maxUint128,
        amount1Max: maxUint128,
      },
    ],
  })

  return {
    address,
    owner,
    positionId,
    token0,
    token1,
    fees: {
      token0: Number(formatEther(fees.result[0])),
      token1: Number(formatEther(fees.result[1])),
    },
  } as Pool
}

export const usePool = (tokenAddress: `0x${string}`) => {
  const config = useConfig()
  const chainId = useChainId()
  const client = usePublicClient()

  return useQuery({
    queryKey: ['pool', { tokenAddress, chainId }],
    queryFn: () => fetchPool(client, config, chainId, tokenAddress),
  })
}
