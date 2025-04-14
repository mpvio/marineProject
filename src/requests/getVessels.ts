//import { z } from 'zod'
import { type Vessel } from './models/vessel'
import axios from 'axios'

type GetVesselsResponse = {
  data: Vessel[]
}

export async function getVessels(): Promise<Vessel[]> {
  try {
    const { data, status } = await axios.get<GetVesselsResponse>('http://127.0.0.1:8000/', {
      headers: {
        Accept: 'application/json',
      },
    })

    console.log(JSON.stringify(data))
    console.log(status)
    return data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message)
      const v: Vessel = {
        id: 0,
        name: error.message,
        latitude: 0,
        longitude: 0,
      }
      return [v]
    } else {
      console.log(error)
      const v: Vessel = {
        id: 0,
        name: String(error),
        latitude: 0,
        longitude: 0,
      }
      return [v]
    }
  }

  // const headers = new Headers({
  //   Accept: 'application/json',
  // })

  // const request = new Request('http://127.0.0.1:8000/', {
  //   method: 'GET',
  //   headers,
  // })

  // const responseValue = await fetch(request)

  // try {
  //   const result = zVesselList.parse(responseValue)
  //   return result as Vessel[]
  // } catch (err) {
  //   if (err instanceof z.ZodError) {
  //     console.log(err.issues)
  //   }
  // } finally {
  //   return [] as Vessel[]
  // }

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
