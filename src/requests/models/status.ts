import { z } from 'zod'

// export interface Status {
//   id: number
//   status: string
// }

export const zStatus = z.object({
  id: z.number(),
  status: z.string(),
})

export type Status = z.TypeOf<typeof zStatus>
