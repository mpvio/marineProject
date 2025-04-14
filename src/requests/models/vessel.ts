import { z } from 'zod'

// interface Vessel {
//   id: number
//   name: string
//   latitude: number
//   longitude: number
// }

export const zVessel = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

export const zVesselList = z.array(zVessel)

export type Vessel = z.TypeOf<typeof zVessel>
export type Vessels = z.TypeOf<typeof zVesselList>

//export type { Vessel }
