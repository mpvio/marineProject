import type { Vessel } from "./models/vessel";

export function getVessel(id: number): Promise<Vessel> {
  const headers: Headers = new Headers();
  const request: RequestInfo = new Request(
    `http://127.0.0.1:8000/${id}`,
    {
      method: "GET",
      headers: headers
    }
  );
  return fetch(request)
    .then(res => res.json())
    .then(res => {
      return res as Vessel
    });
}
