<script setup lang="ts">
import type { MarkerOptions, Position } from '@/models/markerOptions'
import { GoogleMap, Marker } from 'vue3-google-map'
import VesselList from '../components/VesselList.vue'
import { VesselApi } from '@/api/VesselApi'
import type { Vessel } from '@/models/Vessel'
import { ref } from 'vue'

// const center: Position = {
//   lat: 0,
//   lng: 0,
// }

const markers: MarkerOptions[] = []

// for (let i = 0; i < 9; i++) {
//   const pos: Position = {
//     lat: i * 10,
//     lng: i * 10,
//   }
//   const mark: MarkerOptions = {
//     position: pos,
//     label: 'T' + String(i),
//     title: 'Test ' + String(i),
//   }
//   markers.push(mark)
// }

const vessels: Vessel[] = await VesselApi.getAll()

vessels.forEach((vessel: Vessel) => {
  const pos: Position = {
    lat: vessel.latitude,
    lng: vessel.longitude,
  }
  const marker: MarkerOptions = {
    position: pos,
    label: String(vessel.id),
    title: vessel.name,
  }
  markers.push(marker)
})

// let center: Position = {
//   lat: 0,
//   lng: 0,
// }

const center = ref<Position>({ lat: 0, lng: 0 })

if (markers.length) {
  const first = markers[0]
  center.value.lat = first.position.lat
  center.value.lng = first.position.lng
  console.log(`${center.value}, ${first.position}`)
}
</script>

<template>
  <GoogleMap
    api-key="AIzaSyAe3a0ujO-avuX4yiadKUVIHyKG5YY83tw"
    style="width: 100%; height: 500px"
    :center="center"
    :zoom="15"
  >
    <Marker v-for="marker in markers" :key="marker.label" :options="marker" />
  </GoogleMap>
  <!-- <VesselList :markers="markers" /> -->
</template>
