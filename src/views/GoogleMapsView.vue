<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import type { MarkerOptions, Position } from '@/models/markerOptions'
import type { Vessel } from '@/models/Vessel'
import { VesselApi } from '@/api/VesselApi'
import VesselList from '../components/VesselList.vue'

const markers = ref<MarkerOptions[]>([])
const center = ref<Position>({ lat: 0, lng: 0 })
const isLoading = ref(true)

const fetchVessels = async () => {
  isLoading.value = true
  try {
    const vessels = await VesselApi.getAll()

    markers.value = vessels.map((vessel: Vessel) => ({
      position: {
        lat: vessel.latitude,
        lng: vessel.longitude,
      },
      label: String(vessel.id),
      title: vessel.name,
    }))

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

const handleMarkerDeleted = async () => {
  await fetchVessels()
}

const handleMarkerUpdated = async () => {
  await fetchVessels()
}

const handleMarkerCreated = async () => {
  await fetchVessels()
}

onMounted(() => {
  fetchVessels()
})
</script>

<template>
  <div v-if="!isLoading" class="map-list-container">
    <div class="map-section">
      <GoogleMap
        api-key="AIzaSyAe3a0ujO-avuX4yiadKUVIHyKG5YY83tw"
        style="width: 100%; height: 500px"
        :center="center"
        :zoom="15"
      >
        <Marker v-for="marker in markers" :key="marker.label" :options="marker" />
      </GoogleMap>
    </div>
    <div class="list-section">
      <VesselList
        :markers="markers"
        @marker-deleted="handleMarkerDeleted"
        @marker-updated="handleMarkerUpdated"
        @marker-created="handleMarkerCreated"
      />
    </div>
  </div>
  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading map data...</p>
  </div>
</template>

<style scoped>
.map-list-container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  height: 500px;
}

.map-section {
  flex: 2 1 0;
  min-width: 0;
}

.list-section {
  flex: 1 1 0;
  min-width: 0;
  overflow-y: auto;
  background: #fafbfc;
  border-left: 1px solid #eee;
  padding: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
