import { z } from 'zod'

const dexDataSchema = z.object({
  address: z.custom<`0x${string}`>(),
  poolAddress: z.custom<`0x${string}`>(),
  volume: z
    .object({
      h24: z.number(),
    })
    .optional(),
  liquidity: z.number().optional(),
  marketCap: z.number().optional(),
})

export type DexData = z.infer<typeof dexDataSchema>
