/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_FULLSTORY_ORG_ID: string
  readonly VITE_PINATA_JWT: string
  readonly VITE_GATEWAY_URL: string
  readonly VITE_RPC_PROVIDER_URL: string
  readonly VITE_PAYMASTER_SERVICE_URL: string
  readonly VITE_PAYMASTER_PROXY_URL: string

  readonly VITE_USD_MARKET_CAP: number

  readonly VITE_WETH_ADDRESS_8453: string
  readonly VITE_UNISWAP_V3_FACTORY_ADDRESS_8453: string
  readonly VITE_UNISWAP_V3_NONFUNGIBLE_POSITION_MANAGER_ADDRESS_8453: string
  readonly VITE_UNISWAP_V3_QUOTER_ADDRESS_8453: string
  readonly VITE_ETH_USD_AGGREGATOR_ADDRESS_8453: string

  readonly VITE_FRAME_APP_PROXY_URL: string

  readonly VITEST?: 'true' | 'false'
  readonly CI?: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __ENABLE_MSW_IN_PROD__: boolean
