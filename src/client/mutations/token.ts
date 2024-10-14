import { useMutation, useQuery } from '@tanstack/react-query'

import { multicall } from '@wagmi/core'
import {
  formatEther,
  parseEther,
  parseUnits,
  parseEventLogs,
  WalletClient,
  numberToHex,
} from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { Config, useAccount, useChainId, useConfig, usePublicClient, useWalletClient } from 'wagmi'
import { publicActionsL2 } from 'viem/op-stack'

import { FeeAmount } from '@uniswap/v3-sdk'
import { calculateInitialTick } from '@/common/utils'
import { fetchUsdEthAmount } from '../queries/eth'
import { useWriteContract } from '@/common/utils/smartWallet'
import { fomoFactoryAbi, iUniswapV3FactoryAbi, liquidityLockerAbi } from '../abi/generated'

async function addTokenToWallet(
  client: WalletClient | undefined,
  data: { address: `0x${string}`; symbol: string; decimals: number; image?: string },
) {
  if (!client) throw new Error('Failed to initialize client')

  const added = await client.watchAsset({
    type: 'ERC20',
    options: {
      address: data.address,
      symbol: data.symbol,
      decimals: data.decimals,
      image: data.image,
    },
  })

  if (!added) throw new Error('Failed to add token to wallet')
}

export const useAddTokenToWallet = (options?: {
  onError?: (error: unknown) => void
  onSuccess?: () => void
}) => {
  const chainId = useChainId()
  const { data: client } = useWalletClient()

  return useMutation({
    ...options,
    mutationKey: ['addTokenToWallet', { chainId }],
    mutationFn: (data: {
      address: `0x${string}`
      symbol: string
      decimals: number
      image?: string
    }) => addTokenToWallet(client, data),
  })
}

async function prepareCreateToken(
  config: Config,
  chainId: number,
  data: {
    name: string
    symbol: string
    totalSupply: number
    salt: number
    initialBuy?: number
  },
) {
  const [protocolFeeEth, tickSpacing] = await multicall(config, {
    allowFailure: false,
    contracts: [
      {
        address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
        abi: fomoFactoryAbi,
        functionName: 'protocolFee',
      },
      {
        address: import.meta.env[`VITE_UNISWAP_V3_FACTORY_ADDRESS_${chainId}`],
        abi: iUniswapV3FactoryAbi,
        functionName: 'feeAmountTickSpacing',
        args: [FeeAmount.HIGH],
      },
    ],
  })
  const marketCap = await fetchUsdEthAmount(config, chainId, import.meta.env.VITE_USD_MARKET_CAP)
  const protocolFee = Number(formatEther(protocolFeeEth as bigint))
  const totalSupply = parseUnits(data.totalSupply.toString(), 18)
  const value = parseEther((Number(data.initialBuy || 0) + protocolFee).toString())
  const initialTick = calculateInitialTick(data.totalSupply, marketCap, tickSpacing as number)

  return {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: fomoFactoryAbi,
    functionName: 'createMemecoin',
    args: [
      data.name,
      data.symbol,
      totalSupply,
      initialTick,
      FeeAmount.HIGH,
      numberToHex(data.salt, { size: 32 }),
    ],
    value,
    chain: undefined,
  }
}

export const useEstimateCreateToken = (data: {
  name: string
  symbol: string
  totalSupply: number
  salt: number
  initialBuy?: number
}) => {
  const chainId = useChainId()
  const config = useConfig()
  const client = usePublicClient()?.extend(publicActionsL2())
  const account = useAccount()

  return useQuery({
    queryKey: ['estimateCreateToken', { chainId, ...data }],
    queryFn: async () => {
      if (!client) throw new Error('Failed to initialize client')
      if (!account || !account.address) throw new Error('Failed to initialize account')

      const args = await prepareCreateToken(config, chainId, data)
      const gas =
        (await client.estimateContractTotalFee({ ...args, account: account.address } as any)) +
        args.value

      return Number(formatEther(gas))
    },
  })
}

export const useCreateToken = (options?: {
  onError?: (error: unknown) => void
  onSuccess?: (data: `0x${string}`) => void
}) => {
  const chainId = useChainId()
  const config = useConfig()
  const client = usePublicClient()
  const { writeContract } = useWriteContract()

  return useMutation({
    ...options,
    mutationKey: ['createToken', { chainId }],
    mutationFn: async (data: {
      name: string
      symbol: string
      totalSupply: number
      salt: number
      initialBuy?: number
    }) => {
      if (!client) throw new Error('Failed to initialize client')

      const args = await prepareCreateToken(config, chainId, data)
      const hash = await writeContract(config, args)
      const receipt = await waitForTransactionReceipt(client, { hash })

      const logs = parseEventLogs({
        abi: fomoFactoryAbi,
        eventName: 'MemecoinCreated',
        logs: receipt.logs,
      })

      const event = logs[0]!.args as {
        creator: `0x${string}`
        memecoin: `0x${string}`
        name: string
        symbol: string
        totalSupply: bigint
      }

      return event.memecoin
    },
  })
}

export const useClaimFees = (options?: {
  onError?: (error: unknown) => void
  onSuccess?: () => void
}) => {
  const chainId = useChainId()
  const config = useConfig()
  const client = usePublicClient()
  const { writeContract } = useWriteContract()

  return useMutation({
    ...options,
    mutationKey: ['claimFees', { chainId }],
    mutationFn: async (data: { positionId: bigint; recipient: `0x${string}` }) => {
      if (!client) throw new Error('Failed to initialize client')

      const hash = await writeContract(config, {
        address: import.meta.env[`VITE_LIQUIDITY_LOCKER_ADDRESS_${chainId}`],
        abi: liquidityLockerAbi,
        functionName: 'claimFees',
        args: [data.positionId, data.recipient],
      })

      await waitForTransactionReceipt(client, { hash })
    },
  })
}
