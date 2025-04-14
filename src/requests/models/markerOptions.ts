console.log('Hello World!')

interface Position {
  lat: number
  lng: number
}

interface MarkerOptions {
  position: Position
  label: string
  title: string
}

export type { MarkerOptions, Position }

/*
  const center = { lat: 40.689247, lng: -74.044502 }
  const markerOptions = { position: center, label: '1', title: 'FROG' }
*/
