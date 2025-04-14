import { z } from 'zod'
import { zVesselList, type Vessel } from './models/vessel'

export async function getVessels(): Promise<Vessel[]> {
  const headers = new Headers({
    Accept: 'application/json',
  })

  const request = new Request('http://127.0.0.1:8000/', {
    method: 'GET',
    headers,
  })

  const responseValue = await fetch(request)

  try {
    const result = zVesselList.parse(responseValue)
    return result as Vessel[]
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.issues)
    }
  } finally {
    return [] as Vessel[]
  }

  // return fetch(request)
  //   .then((res) => {
  //     if (!res.ok) {
  //       throw new Error(`HTTP error! status: ${res.status}`)
  //     }
  //     return res.json()
  //   })
  //   .then((res) => res as Vessel[])
  //   .catch((err) => {
  //     console.error('Fetch failed:', err.message)
  //     throw err
  //   })
}
