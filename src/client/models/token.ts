import { z } from 'zod'

const tokenSchema = z.object({
  address: z.custom<`0x${string}`>(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  totalSupply: z.number(),
  avatar: z.string().optional(),
  description: z.string().optional(),
  metadata: z
    .object({
      twitter: z.string().optional(),
      telegram: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
})

export type Token = z.infer<typeof tokenSchema>
