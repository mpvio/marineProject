import type { Status } from "./models/status";

export function deleteVessel(id: number): Promise<Status> {
  const headers: Headers = new Headers();

  const request: RequestInfo = new Request(
    `http://127.0.0.1:8000/delete/${id}`,
    {
      method: "PUT",
      headers: headers
    });

  return fetch(request)
    .then(res => res.json())
    .then(res => {
      return res as Status
    });
}
