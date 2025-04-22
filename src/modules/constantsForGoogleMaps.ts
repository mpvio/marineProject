import type { MarkerOptions, Position } from '@/models/markerOptions'
import { ref } from 'vue'

export const constantsForGoogleMaps = () => {
  //map markers and "center" for loading map
  const markers = ref<MarkerOptions[]>([])
  const center = ref<Position>({ lat: 0, lng: 0 })

  //display a loading message if loading
  const isLoading = ref(true)

  //track mouse click position if creating a new marker (prompt doesn't appear if null)
  const newMarkerPosition = ref<Position | null>(null)

  //flags for displaying popups
  const showCreateDialogue = ref(false)
  const newVesselName = ref('')

  // for editing existing marker
  const selectedMarker = ref<MarkerOptions | null>(null)
  const editForm = ref({
    // Store edit popup's data
    title: '',
    lat: 0,
    lng: 0,
  })

  //for checking last update time
  const lastUpdateTime = ref<number>(0)

  // Polling interval values
  const POLL_INTERVAL = 5000 // 5 seconds

  return {
    markers,
    center,
    isLoading,
    newMarkerPosition,
    showCreateDialogue,
    newVesselName,
    selectedMarker,
    editForm,
    lastUpdateTime,
    POLL_INTERVAL,
  }
}
