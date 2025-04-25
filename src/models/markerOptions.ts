interface Position {
  lat: number
  lng: number
}

interface MarkerOptions {
  position: Position
  label: string
  title: string
}

export type { MarkerOptions, Position } //
