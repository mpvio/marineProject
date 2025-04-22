<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import type { MarkerOptions } from '@/models/markerOptions'
import type { Vessel } from '@/models/Vessel'
import { VesselApi } from '@/api/VesselApi'
import VesselList from '../components/VesselList.vue'
import { constantsForGoogleMaps } from '@/modules/constantsForGoogleMaps'

const {
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
} = constantsForGoogleMaps()

let pollTimer: ReturnType<typeof setTimeout>

const startPolling = () => {
  pollTimer = setTimeout(async () => {
    await checkUpdateTime(true) // check database for updates & reset timer
    startPolling()
  }, POLL_INTERVAL)
}

//when update is true, the function is being called via polling
//else, lastUpdateTime is being manually called when editing db in Vue itself
const checkUpdateTime = async (update: boolean) => {
  try {
    const timestamp = await VesselApi.getLatestUpdate()
    if (timestamp !== lastUpdateTime.value) {
      if (update) {
        await fetchVessels()
      }
      lastUpdateTime.value = timestamp
    }
  } catch (error) {
    console.error('Update check failed:', error)
  }
}

const fetchVessels = async () => {
  isLoading.value = true
  try {
    //get all vessels from db and convert them into markers (and add to array)
    const vessels = await VesselApi.getAll()
    markers.value = vessels.map((vessel: Vessel) => ({
      position: {
        lat: vessel.latitude,
        lng: vessel.longitude,
      },
      label: String(vessel.id),
      title: vessel.name,
    }))

    //if at least one marker exists, set the starting point of the map on it
    if (markers.value.length) {
      center.value = {
        lat: markers.value[0].position.lat,
        lng: markers.value[0].position.lng,
      }
    }
  } catch (error) {
    console.error('Failed to load vessels:', error)
  } finally {
    isLoading.value = false
  }
}

//for creating marker by clicking on the map
const handleMapClick = (e: google.maps.CustomMarkerOptions['position']) => {
  if (!e.latLng) return
  newMarkerPosition.value = {
    lat: e.latLng.lat(),
    lng: e.latLng.lng(),
  }
  showCreateDialogue.value = true
}

//cancelCreate needs to be a separate function to remove temporary "NEW" marker
const cancelCreate = () => {
  showCreateDialogue.value = false
  newMarkerPosition.value = null
}

//for editing an existing marker
const handleMarkerClick = (marker: MarkerOptions) => {
  selectedMarker.value = marker
  //editForm having a value makes it appear onscreen
  editForm.value = {
    title: marker.title,
    lat: marker.position.lat,
    lng: marker.position.lng,
  }
}

const createVesselFromClick = async () => {
  //submit entered marker data to db via POST *if* valid data is included
  if (!newMarkerPosition.value || !newVesselName.value.trim()) return

  try {
    await VesselApi.create({
      name: newVesselName.value,
      latitude: newMarkerPosition.value.lat,
      longitude: newMarkerPosition.value.lng,
    })
    await handleDatabaseEditViaVueCode() //refresh page
  } catch (error) {
    console.error('Failed to create vessel:', error)
  } finally {
    newVesselName.value = ''
    newMarkerPosition.value = null
    showCreateDialogue.value = false
  }
}

//for editing an existing marker
const updateSelectedMarker = async () => {
  if (!selectedMarker.value) return

  try {
    //match vessel's id and editForm's values to api inputs and send
    await VesselApi.update(Number(selectedMarker.value.label), {
      name: editForm.value.title,
      latitude: editForm.value.lat,
      longitude: editForm.value.lng,
    })
    await handleDatabaseEditViaVueCode()
    selectedMarker.value = null
  } catch (error) {
    console.error('Update failed:', error)
  }
}

const deleteSelectedMarker = async () => {
  if (!selectedMarker.value) return

  try {
    //delete vessel from map marker
    await VesselApi.delete(Number(selectedMarker.value.label))
    await handleDatabaseEditViaVueCode()
    selectedMarker.value = null
  } catch (error) {
    console.error('Delete failed:', error)
  }
}

const handleDatabaseEditViaVueCode = async () => {
  await checkUpdateTime(false)
  await fetchVessels()
}

onMounted(() => {
  fetchVessels() //read from db as soon as page is loaded
  startPolling() //start timer for checking database
})

onUnmounted(() => {
  clearTimeout(pollTimer)
})
</script>

<template>
  <div class="container">
    <div class="map-container">
      <GoogleMap
        api-key="AIzaSyAe3a0ujO-avuX4yiadKUVIHyKG5YY83tw"
        style="width: 100%; height: 100%"
        :center="center"
        :zoom="15"
        @click="handleMapClick"
      >
        <Marker
          v-for="marker in markers"
          :key="marker.label"
          :options="marker"
          @click="handleMarkerClick(marker)"
        />
        <!-- this should only appear if a new position has been clicked (createDialogue will be set to True) -->
        <Marker
          v-if="newMarkerPosition && showCreateDialogue"
          :options="{
            position: newMarkerPosition,
            label: 'NEW',
            title: 'New vessel location',
          }"
        />
      </GoogleMap>

      <!-- Create Vessel Popup -->
      <div v-if="showCreateDialogue" class="create-dialogue">
        <h3>Create New Vessel</h3>
        <p>
          Coordinates: {{ newMarkerPosition?.lat.toFixed(6) }},
          {{ newMarkerPosition?.lng.toFixed(6) }}
        </p>
        <input v-model="newVesselName" placeholder="Enter vessel name" />
        <div class="dialogue-actions">
          <button @click="createVesselFromClick" class="good-btn">Create</button>
          <button @click="cancelCreate">Cancel</button>
        </div>
      </div>

      <!-- Edit Vessel Popup -->
      <div v-if="selectedMarker" class="create-dialogue">
        <h3>Edit Vessel</h3>
        <p>
          Current Coordinates: {{ selectedMarker.position.lat.toFixed(6) }},
          {{ selectedMarker.position.lng.toFixed(6) }}
        </p>
        <input v-model="editForm.title" placeholder="Vessel name" />
        <div class="coord-inputs">
          <div>
            <label>Lat:</label>
            <input type="number" v-model.number="editForm.lat" step="0.000001" />
          </div>
          <div>
            <label>Lng:</label>
            <input type="number" v-model.number="editForm.lng" step="0.000001" />
          </div>
        </div>
        <div class="dialogue-actions">
          <button @click="deleteSelectedMarker" class="delete-btn">Delete</button>
          <!-- Separate delete button from update options -->
          <div class="action-spacer"></div>
          <button @click="updateSelectedMarker" class="good-btn">Save</button>
          <button @click="selectedMarker = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- track possible emissions from VesselList -->
    <div class="list-container">
      <VesselList :markers="markers" @marker-changed="handleDatabaseEditViaVueCode" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: calc(100vh - 60px);
  gap: 20px;
  padding: 20px;
}

.map-container {
  flex: 2;
  min-width: 0;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.list-container {
  flex: 1;
  min-width: 350px;
  height: 100%;
  overflow-y: auto;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.create-dialogue {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  color: black;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 300px;
}

.create-dialogue input[type='text'] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.coord-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 10px 0;
}

.coord-inputs label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 0.9rem;
}

.coord-inputs input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.dialogue-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;
}

.dialogue-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.dialogue-actions button:hover {
  opacity: 0.9;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  margin-right: auto;
}

.good-btn {
  background-color: #4285f4;
  color: white;
}

.dialogue-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.action-spacer {
  flex-grow: 1;
}
</style>
