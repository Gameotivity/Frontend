import { useMutation } from '@tanstack/react-query'
import { TokenMetadata } from '../models/tokenMetadata'
import { useChainId } from 'wagmi'

const avatarFileName = (address: `0x${string}`, avatar: File) => {
  return `${address}.${avatar.name.split('.').pop()}`
}

const setTokenMetadata = async (metadata: TokenMetadata, chainId: number) => {
  const fileName = avatarFileName(metadata.address, metadata.avatar)
  const formData = new FormData()
  formData.append('file', metadata.avatar, fileName)
  const data = JSON.stringify({
    name: metadata.address,
    keyvalues: {
      fileName: fileName,
      chainId: chainId,
      description: metadata.description,
      twitter: metadata.twitter,
      telegram: metadata.telegram,
      website: metadata.website,
    },
  })
  formData.append('pinataMetadata', data)

  const options = JSON.stringify({
    cidVersion: 0,
    wrapWithDirectory: true,
  })
  formData.append('pinataOptions', options)

  await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
    },
    body: formData,
  })
}

export const useSetTokenMetadata = (options?: { onError?: (error: unknown) => void }) => {
  const chainId = useChainId()

  return useMutation({
    ...options,
    mutationKey: ['tokenMetadata', { chainId }],
    mutationFn: (metadata: TokenMetadata) => setTokenMetadata(metadata, chainId),
  })
}
