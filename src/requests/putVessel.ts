import type { Status } from "./models/status";
import type { Vessel } from "./models/vessel";

export async function putVessel(
  id: number,
  name: string,
  latitude: number,
  longitude: number
): Promise<Status> {
  const headers: Headers = new Headers();

  const body: Vessel = {
    id: id,
    name: name,
    latitude: latitude,
    longitude: longitude
  };

  const request: RequestInfo = new Request(
    `http://127.0.0.1:8000/update/${id}`,
    {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(body)
    });

  return fetch(request)
    .then(res => res.json())
    .then(res => {
      return res as Status
    });
}
