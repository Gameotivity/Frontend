import { providers } from 'ethers'
import { useMemo } from 'react'
import {
  Account,
  Chain,
  Client,
  custom,
  RpcRequestError,
  Transport,
  WalletCapabilities,
} from 'viem'
import { writeContract, WriteContractParameters } from '@wagmi/core'
import { Config, useAccount } from 'wagmi'
import { useCapabilities } from 'wagmi/experimental'
import { getCallsStatus, sendCalls, writeContracts } from '@wagmi/core/experimental'
import { poll } from '@ethersproject/web'
import { useEthersProvider } from './ethers'

export function clientToSmartWalletSigner(
  config: Config,
  client: Client<Transport, Chain, Account>,
  chain: Chain,
  capabilities: WalletCapabilities,
) {
  const { account, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  const smartWalletTransport = custom({
    request: async (request) => {
      const { method, params } = request
      if (method === 'eth_sendTransaction') {
        try {
          const id = await sendCalls(config, {
            account: account.address,
            calls: [
              {
                to: params[0].to,
                data: params[0].data,
                value: params[0].value,
              },
            ],
            capabilities,
          })

          return await poll<`0x${string}`>((async () => {
            const status = await getCallsStatus(config, {
              id,
            })
            if (!status.receipts?.length) return undefined
            return status.receipts![0]!.transactionHash
          }) as () => Promise<`0x${string}`>)
        } catch (error: any) {
          throw new RpcRequestError({
            body: request,
            error: { code: error.code, message: error.message },
            url: chain.rpcUrls.default.http[0]!!,
          })
        }
      }

      return await transport.request(request)
    },
  })

  const provider = new providers.Web3Provider(smartWalletTransport({ chain }), network)
  return provider.getSigner(account.address)
}

export function useSmartWallet() {
  const account = useAccount()
  const { data: availableCapabilities, isSuccess: capabilitiesSupported } = useCapabilities({
    account: account.address,
  })
  const capabilities = useMemo(() => {
    if (!availableCapabilities || !account.chainId) return {}
    const capabilitiesForChain = availableCapabilities[account.chainId]
    if (
      capabilitiesForChain &&
      capabilitiesForChain['paymasterService'] &&
      capabilitiesForChain['paymasterService'].supported
    ) {
      return {
        paymasterService: {
          url: import.meta.env.VITE_PAYMASTER_PROXY_URL,
        },
      }
    }
    return {}
  }, [availableCapabilities, account])

  return useMemo(() => {
    const capabilitiesForChain =
      availableCapabilities && account.chainId ? availableCapabilities[account.chainId] : undefined
    return {
      capabilities: capabilitiesSupported ? capabilities : undefined,
      isSmartWallet: capabilitiesSupported,
      availableCapabilities: capabilitiesForChain,
    }
  }, [capabilities, capabilitiesSupported, availableCapabilities, account])
}

export function useWriteContract() {
  const { capabilities, isSmartWallet } = useSmartWallet()
  const provider = useEthersProvider()

  return useMemo(() => {
    if (!isSmartWallet || !capabilities)
      return {
        writeContract: async (config: Config, args: WriteContractParameters) =>
          await writeContract(config, args),
      }
    return {
      writeContract: async (config: Config, args: WriteContractParameters) => {
        const id = await writeContracts(config, {
          contracts: [args],
          capabilities,
        })
        return await poll<`0x${string}`>(
          (async () => {
            const status = await getCallsStatus(config, {
              id,
            })
            if (!status.receipts?.length) return undefined
            return status.receipts![0]!.transactionHash
          }) as () => Promise<`0x${string}`>,
          { oncePoll: provider },
        )
      },
    }
  }, [capabilities, isSmartWallet, provider])
}
