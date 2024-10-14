import { z } from 'zod'

const tokenMetadataSchema = z.object({
  address: z.custom<`0x${string}`>(),
  avatar: z.instanceof(File),
  description: z.string(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  website: z.string().optional(),
})

export type TokenMetadata = z.infer<typeof tokenMetadataSchema>
