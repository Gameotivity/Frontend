import { defineConfig } from '@wagmi/cli'
import { Abi, erc20Abi } from 'viem'

import FomoFactoryABI from './src/client/abi/FomoFactory.json'
import LiquidityLockerABI from './src/client/abi/LiquidityLocker.json'

import AggregatorV3Interface from '@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json' assert { type: 'json' }
import IUniswapV3FactoryABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json' assert { type: 'json' }
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json' assert { type: 'json' }
import INonfungiblePositionManagerABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json' assert { type: 'json' }
import IQuoterV2ABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json' assert { type: 'json' }
import IUniversalRouterABI from '@uniswap/universal-router/artifacts/contracts/interfaces/IUniversalRouter.sol/IUniversalRouter.json' assert { type: 'json' }

const smartWalletABI = [
  {
    type: 'function',
    name: 'execute',
    inputs: [
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'executeBatch',
    inputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        internalType: 'struct CoinbaseSmartWallet.Call[]',
        components: [
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
]

export default defineConfig({
  out: 'src/client/abi/generated.ts',
  contracts: [
    {
      name: 'ERC20',
      abi: erc20Abi,
    },
    {
      name: 'FomoFactory',
      abi: FomoFactoryABI as Abi,
    },
    {
      name: 'LiquidityLocker',
      abi: LiquidityLockerABI as Abi,
    },
    {
      name: 'AggregatorV3Interface',
      abi: AggregatorV3Interface.abi as Abi,
    },
    {
      name: 'IUniswapV3Factory',
      abi: IUniswapV3FactoryABI.abi as Abi,
    },
    {
      name: 'IUniswapV3Pool',
      abi: IUniswapV3PoolABI.abi as Abi,
    },
    {
      name: 'INonfungiblePositionManager',
      abi: INonfungiblePositionManagerABI.abi as Abi,
    },
    {
      name: 'IQuoterV2',
      abi: IQuoterV2ABI.abi as Abi,
    },
    {
      name: 'IUniversalRouter',
      abi: IUniversalRouterABI.abi as Abi,
    },
    {
      name: 'SmartWallet',
      abi: smartWalletABI as Abi,
    },
  ],
  plugins: [],
})
