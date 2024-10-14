import { z } from 'zod'

const poolSchema = z.object({
  address: z.custom<`0x${string}`>(),
  owner: z.custom<`0x${string}`>(),
  positionId: z.bigint(),
  token0: z.custom<`0x${string}`>(),
  token1: z.custom<`0x${string}`>(),
  fees: z.object({
    token0: z.number(),
    token1: z.number(),
  }),
})

export type Pool = z.infer<typeof poolSchema>
