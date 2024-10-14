import { Token } from '../models/token'

import { useQuery } from '@tanstack/react-query'

import { readContract, multicall } from '@wagmi/core'
import {
  formatEther,
  formatUnits,
  maxUint256,
  numberToHex,
  parseEther,
  parseUnits,
  PublicClient,
} from 'viem'
import { Config, useAccount, useChainId, useConfig, usePublicClient } from 'wagmi'

import { FeeAmount } from '@uniswap/v3-sdk'
import { fetchEthUsdAmount } from './eth'
import { erc20Abi, fomoFactoryAbi, iQuoterV2Abi } from '../abi/generated'
import { fetchTokensDexData } from './dex'

interface TokensMetadata {
  count: number
  rows: {
    ipfs_pin_hash: string
    metadata: {
      name: string
      keyvalues: {
        description: string
        fileName: string
        telegram: string
        twitter: string
        website: string
      }
    }
  }[]
}

const fetchMetadata = async (address: `0x${string}`) => {
  const res = await fetch(
    `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${address}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
    },
  )

  const resData = (await res.json()) as TokensMetadata
  if (resData.rows.length > 0) {
    const avatar = resData.rows[0]!!
    return {
      avatar: `${import.meta.env.VITE_GATEWAY_URL}/ipfs/${avatar.ipfs_pin_hash}/${avatar.metadata.keyvalues.fileName}`,
      description: avatar.metadata.keyvalues.description,
      telegram: avatar.metadata.keyvalues.telegram,
      twitter: avatar.metadata.keyvalues.twitter,
      website: avatar.metadata.keyvalues.website,
    }
  }
  return undefined
}

const fetchTokensMetadata = async (tokens: `0x${string}`[]) => {
  const pageLimit = 1000
  let pageOffset = 0
  const fetchMore = async () =>
    (await (
      await fetch(
        `https://api.pinata.cloud/data/pinList?status=pinned&pageOffset=${pageOffset}&pageLimit=${pageLimit}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
        },
      )
    ).json()) as TokensMetadata

  let resData = await fetchMore()
  let rows = resData.rows
  while (rows.length < resData.count) {
    pageOffset += resData.rows.length
    resData = await fetchMore()
    rows = rows.concat(resData.rows)
  }

  if (rows.length > 0) {
    const metadataMap = new Map(
      resData.rows.map((row) => {
        return [row.metadata.name, row]
      }),
    )

    return tokens.map((token) => {
      const data: any = metadataMap.get(token)
      if (!data) return undefined
      return {
        avatar: `${import.meta.env.VITE_GATEWAY_URL}/ipfs/${data.ipfs_pin_hash}/${data.metadata.keyvalues.fileName}`,
        description: data.metadata.keyvalues.description,
        telegram: data.metadata.keyvalues.telegram,
        twitter: data.metadata.keyvalues.twitter,
        website: data.metadata.keyvalues.website,
      }
    })
  }
  return tokens.map(() => undefined)
}

export const fetchTokensData = async (
  config: Config,
  tokens: `0x${string}`[],
  includeMetadata: boolean = true,
) => {
  const request = tokens.flatMap((token) => [
    {
      address: token,
      abi: erc20Abi,
      functionName: 'name',
    },
    {
      address: token,
      abi: erc20Abi,
      functionName: 'symbol',
    },
    {
      address: token,
      abi: erc20Abi,
      functionName: 'totalSupply',
    },
    {
      address: token,
      abi: erc20Abi,
      functionName: 'decimals',
    },
  ])

  const data = await multicall(config, {
    allowFailure: false,
    contracts: request,
  })

  let tokensMetadataMap: Map<`0x${string}`, any> = new Map()

  if (includeMetadata) {
    const tokensMetadata = await fetchTokensMetadata(tokens)
    tokensMetadataMap = new Map(
      tokensMetadata.map((metadata, idx) => {
        return [tokens[idx]!!, metadata]
      }),
    )
  }

  const tokensData = data.reduce((acc: Token[], _, idx) => {
    if (idx % 4 === 0) {
      const address = tokens[acc.length]!!
      const metadata = tokensMetadataMap.get(address)
      if (!metadata && includeMetadata) return acc

      acc.push({
        address,
        name: data[idx] as string,
        symbol: data[idx + 1] as string,
        totalSupply: Number(formatEther(data[idx + 2] as bigint)),
        decimals: data[idx + 3] as number,
        avatar: metadata?.avatar,
        description: metadata?.description,
        metadata,
      })
    }
    return acc
  }, [])

  return tokensData
}

const fetchToken = async (config: Config, address: `0x${string}`) => {
  const tokens = await fetchTokensData(config, [address])
  if (tokens.length !== 1) {
    throw new Error('Token not found')
  }

  return tokens[0]
}

export const useToken = (address: `0x${string}`) => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['token', { address, chainId }],
    queryFn: () => fetchToken(config, address),
  })
}

const fetchTokenUsdAmount = async (
  client: PublicClient | undefined,
  config: Config,
  chainId: number,
  address: `0x${string}`,
  tokenAmount: number,
) => {
  if (!client) throw new Error('Failed to initialize client')

  const quote = await client.simulateContract({
    address: import.meta.env[`VITE_UNISWAP_V3_QUOTER_ADDRESS_${chainId}`],
    abi: iQuoterV2Abi,
    functionName: 'quoteExactOutputSingle',
    args: [
      {
        tokenIn: address,
        tokenOut: import.meta.env[`VITE_WETH_ADDRESS_${chainId}`],
        amount: parseEther('0.0001'),
        fee: FeeAmount.HIGH,
        sqrtPriceLimitX96: 0n,
      },
    ],
  })

  const decimals = await readContract(config, {
    address,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  const referenceTokenPrice = Number(formatUnits(quote.result[0] as bigint, decimals as number))
  const referenceEthPrice = await fetchEthUsdAmount(config, chainId, 0.0001)

  return (referenceEthPrice / referenceTokenPrice) * tokenAmount
}

export const useTokenUsdAmount = (address: `0x${string}`, tokenAmount: number) => {
  const chainId = useChainId()
  const client = usePublicClient()
  const config = useConfig()

  return useQuery({
    queryKey: ['tokenUsdAmount', { address, tokenAmount, chainId }],
    queryFn: () => fetchTokenUsdAmount(client, config, chainId, address, tokenAmount),
  })
}

const fetchTokenAddress = async (
  config: Config,
  chainId: number,
  name: string,
  symbol: string,
  totalSupply: number,
  salt: number,
  creator?: `0x${string}`,
) => {
  if (!creator) {
    throw new Error('Missing creator address')
  }

  const address = await readContract(config, {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: fomoFactoryAbi,
    functionName: 'computeMemecoinAddress',
    args: [
      creator,
      name,
      symbol,
      parseUnits(totalSupply.toString(), 18),
      numberToHex(salt, { size: 32 }),
    ],
  })

  return address as `0x${string}`
}

const fetchAccountTokens = async (config: Config, chainId: number, account?: `0x${string}`) => {
  if (!account) {
    return []
  }

  const tokens = await readContract(config, {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: fomoFactoryAbi,
    functionName: 'memecoinsOf',
    args: [account],
  })

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
  return dexData
}

const fetchTokens = async (config: Config, chainId: number) => {
  const tokens = await readContract(config, {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: fomoFactoryAbi,
    functionName: 'queryMemecoins',
    args: [0n, maxUint256, false],
  })

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
  return dexData
}

export const useTokenAddress = (
  name: string,
  symbol: string,
  totalSupply: number,
  salt: number,
) => {
  const config = useConfig()
  const chainId = useChainId()
  const { address } = useAccount()

  return useQuery({
    queryKey: ['tokenAddress', { creator: address, name, symbol, totalSupply, salt, chainId }],
    queryFn: () => fetchTokenAddress(config, chainId, name, symbol, totalSupply, salt, address),
  })
}

export const useTokenMetadata = (address: `0x${string}`) => {
  return useQuery({
    queryKey: ['tokenMetadata', { address }],
    queryFn: () => fetchMetadata(address),
    retry: 10,
    retryDelay: 1000,
  })
}

export const useAccountTokens = () => {
  const config = useConfig()
  const chainId = useChainId()
  const account = useAccount()

  return useQuery({
    queryKey: ['accountTokens', { chainId, account: account?.address }],
    queryFn: () => fetchAccountTokens(config, chainId, account?.address),
  })
}

export const useTokens = () => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['tokens', { chainId }],
    queryFn: () => fetchTokens(config, chainId),
  })
}
