<script setup lang="ts">
import type { MarkerOptions, Position } from '@/requests/models/markerOptions'
import { GoogleMap, Marker } from 'vue3-google-map'
import VesselList from '../components/VesselList.vue'
import { getVessels } from '@/requests/getVessels'
//import type { Vessel } from '@/requests/models/vessel'
// import { deleteVessel } from '../requests/deleteVessel'
// import { getVessel } from '../requests/getVessel'
// import { getVessels } from '../requests/getVessels'
// import { postVessel } from '../requests/postVessel'
// import { putVessel } from '../requests/putVessel'
// import type { Vessel } from '../requests/models/vessel'
// import type { MarkerOptions } from '../requests/models/markerOptions'
const center: Position = {
  lat: 0,
  lng: 0,
}

const markers: MarkerOptions[] = []
for (let i = 0; i < 9; i++) {
  const pos: Position = {
    lat: i * 10,
    lng: i * 10,
  }
  const mark: MarkerOptions = {
    position: pos,
    label: 'T' + String(i),
    title: 'Test ' + String(i),
  }
  markers.push(mark)
}

const vList = await getVessels()
for (const vessel of vList) {
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
  <VesselList :markers="markers" />
</template>
