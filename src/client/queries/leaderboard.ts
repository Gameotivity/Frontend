import { useQuery } from '@tanstack/react-query'

import { readContract } from '@wagmi/core'
import { maxUint256 } from 'viem'
import { Config, useChainId, useConfig } from 'wagmi'

import { fomoFactoryAbi } from '../abi/generated'
import { fetchTokensDexData } from './dex'
import { fetchTokensData } from './token'

const fetchTopTokens = async (config: Config, chainId: number) => {
  try {
    console.log(
      'fomo factory address from leaderboard.ts:',
      import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    );

    const tokens = await readContract(config, {
      address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
      abi: fomoFactoryAbi,
      functionName: 'queryMemecoins',
      args: [0n, maxUint256, false],
    });

    console.log('result:', tokens);

    if (!tokens || tokens.length === 0) {
      console.log('No tokens found.');
      return; // stop further processing
    }

    const tokensData = await fetchTokensData(config, tokens as `0x${string}`[]);

    console.log('tokens data:', tokensData);

    const tokensDataMap = new Map(tokensData.map((token) => [token.address, token]));

    const dexData = (await fetchTokensDexData(config, chainId, tokens as `0x${string}`[])).filter((token) => token.marketCap !== null && token.marketCap !== undefined)
    .map((token) => {
      return {
        ...tokensDataMap.get(token.address)!!,
        ...token,
      };
    });
      

    console.log('dexData before filter:', dexData);

    const dexDataSorted = dexData.sort((t1, t2) => t2.marketCap!! - t1.marketCap!!);
    console.log('dexData after sorting:', dexDataSorted);

    const temp = dexDataSorted.map((token, idx) => {
      return { rank: idx + 1, ...token };
    });
    console.log('final result:', temp);

    // Return the final sorted and ranked data
    return temp;
  } catch (error: any) {
    console.error('An error in fetchTopTokens:', error);
    return []; // Return an empty array if there's an error
  }
};


export const useTopTokens = () => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['topTokens', { chainId }],
    queryFn: () => fetchTopTokens(config, chainId),
  })
}
