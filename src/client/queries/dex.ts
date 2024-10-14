import { useQuery } from '@tanstack/react-query'

import { multicall } from '@wagmi/core'
import { formatEther, formatUnits } from 'viem'
import { Config, useChainId, useConfig } from 'wagmi'

import { DexData } from '../models/dex'

import { erc20Abi, fomoFactoryAbi } from '../abi/generated'
import { Token } from '../models/token'
import { fetchTokensData } from './token'

interface Pool {
  id: string
  attributes: {
    base_token_price_usd: number
    base_token_price_native_currency: number
    quote_token_price_usd: number
    quote_token_price_native_currency: number
    address: string
    transactions: {
      h24: {
        buys: number
        sells: number
      }
    }
    volume_usd: {
      h24: number
    }
    fdv_usd: number
    reserve_in_usd: number
  }
  relationships: {
    base_token: {
      data: {
        id: string
      }
    }
    quote_token: {
      data: {
        id: string
      }
    }
  }
}

interface DexResponse {
  data: Pool[]
}

interface PoolBalance {
  tokenBalance: number
  ethBalance: number
}

async function extractDexData(
  chainId: number,
  token: Token,
  poolAddress: `0x${string}`,
  poolBalance: PoolBalance,
  poolData?: Pool,
) {
  if (
    !poolData ||
    !poolData.relationships.base_token.data ||
    !poolData.relationships.quote_token.data
  ) {
    return {
      address: token.address,
      poolAddress,
    } as DexData
  }

  const baseToken = poolData.relationships.base_token.data.id
  const quoteToken = poolData.relationships.quote_token.data.id

  const tokenPrice =
    baseToken.toLowerCase() === `base_${token.address.toLowerCase()}`
      ? poolData.attributes.base_token_price_usd
      : poolData.attributes.quote_token_price_usd
  const ethPrice =
    quoteToken.toLowerCase() ===
    `base_${import.meta.env[`VITE_WETH_ADDRESS_${chainId}`].toLowerCase()}`
      ? poolData.attributes.quote_token_price_usd
      : poolData.attributes.base_token_price_usd

  return {
    address: token.address,
    poolAddress,
    volume: {
      h24: poolData.attributes.volume_usd.h24,
    },
    liquidity: poolBalance.ethBalance * ethPrice + poolBalance.tokenBalance * tokenPrice,
    marketCap: token.totalSupply * tokenPrice,
  } as DexData
}

export async function fetchTokensDexData(
  config: Config,
  chainId: number,
  tokens: `0x${string}`[],
): Promise<DexData[]> {
  try {
    console.log(
      'fomo factor address from dex.ts:',
      import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    )

    // Step 1: Multicall request setup
    const request = tokens.flatMap((token) => {
      return {
        address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
        abi: fomoFactoryAbi,
        functionName: 'poolMetadataOf',
        args: [token],
      }
    })
    console.log('Multicall request:', request)

    // Step 2: Multicall execution
    const poolAddresses = (
      await multicall(config, {
        allowFailure: false,
        contracts: request,
      })
    ).map((data: unknown) => (data as [`0x${string}`, bigint, number])[0] as `0x${string}`)
    console.log('Pool addresses:', poolAddresses)

    // Step 3: Fetching from GeckoTerminal API
    const response = async (addresses: `0x${string}`[]) => {
      return await fetch(
        `https://api.geckoterminal.com/api/v2/networks/base/pools/multi/${addresses.join(',')}`,
      )
    }

    const chunkSize = 30
    let data: Pool[] = []
    for (let i = 0; i < poolAddresses.length; i += chunkSize) {
      const chunk = poolAddresses.slice(i, i + chunkSize)
      console.log('Fetching data for chunk:', chunk)

      const resp = await response(chunk)
      const respData = (await resp.json()) as DexResponse
      console.log('GeckoTerminal API response:', respData)

      if (respData.data) {
        data = data.concat(respData.data)
      }
    }
    console.log('Fetched pool data:', data)

    // Step 4: Handle missing data
    if (!data.length) {
      console.warn('No pool data returned')
      return tokens.map((address, idx) => ({ address, poolAddress: poolAddresses[idx] })) as DexData[]
    }

    const pools = new Map(
      data.map((pool) => {
        return [pool.id.toLowerCase(), pool]
      }),
    )
    console.log('Pools map:', pools)

    // Step 5: Multicall for pool balances and token details
    const poolRequest = poolAddresses.flatMap((address, idx) => [
      {
        address: tokens[idx]!!,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        address: tokens[idx]!!,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: import.meta.env[`VITE_WETH_ADDRESS_${chainId}`],
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      },
    ])
    console.log('Multicall request for pool balances:', poolRequest)

    const poolBalanceData = await multicall(config, {
      allowFailure: false,
      contracts: poolRequest,
    })
    console.log('Pool balance data:', poolBalanceData)

    const poolBalances = poolBalanceData.reduce((acc, _, idx) => {
      if (idx % 3 === 0) {
        acc.push({
          tokenBalance: Number(
            formatUnits(poolBalanceData[idx] as bigint, poolBalanceData[idx + 1] as number),
          ),
          ethBalance: Number(formatEther(poolBalanceData[idx + 2] as bigint)),
        })
      }
      return acc
    }, [] as PoolBalance[])
    console.log('Pool balances:', poolBalances)

    const poolBalancesMap = new Map(
      poolAddresses.map((_, idx) => {
        return [tokens[idx]!!, poolBalances[idx]!!]
      }),
    )
    console.log('Pool balances map:', poolBalancesMap)

    // Step 6: Fetch token data and create token map
    const tokensData = await fetchTokensData(config, tokens, false)
    console.log('Fetched token data:', tokensData)

    const tokensMap = new Map(
      tokensData.map((token) => {
        return [token.address, token]
      }),
    )
    console.log('Tokens map:', tokensMap)

    // Step 7: Extract Dex data
    const dexData = await Promise.all(
      tokens.map(async (token, idx) => {
        const dexInfo = await extractDexData(
          chainId,
          tokensMap.get(token)!!,
          poolAddresses[idx]!!,
          poolBalancesMap.get(token)!!,
          pools.get(`base_${poolAddresses[idx]!!.toLowerCase()}`),
        )
        console.log('Dex data for token:', token, dexInfo)
        return dexInfo
      }),
    )
    console.log('Final Dex data:', dexData)

    return dexData
  } catch (error) {
    console.error('An error occurred in fetchTokensDexData:', error)
    throw error
  }
}


async function fetchTokenDexData(config: Config, chainId: number, token: `0x${string}`) {
  return (await fetchTokensDexData(config, chainId, [token]))[0]
}

export const useDexData = (address: `0x${string}`) => {
  const chainId = useChainId()
  const config = useConfig()

  return useQuery({
    queryKey: ['dexData', { address, chainId }],
    queryFn: () => fetchTokenDexData(config, chainId, address),
  })
}
