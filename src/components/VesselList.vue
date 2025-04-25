<script setup lang="ts">
import { VesselApi } from '@/api/VesselApi'
import type { MarkerOptions } from '@/models/markerOptions'
import type { Vessel } from '@/models/Vessel'
import { constantsForVesselList } from '@/modules/constantsForVesselList'

const { input, idOfMarkerBeingEdited, isCreating, editForm } = constantsForVesselList()

const props = defineProps<{
  markers: MarkerOptions[]
}>()

const emit = defineEmits(['marker-changed'])

function filteredList() {
  return props.markers.filter((mark) =>
    mark.title.toLowerCase().includes(input.value.toLowerCase()),
  )
}

async function deleteMarker(mark: MarkerOptions) {
  await VesselApi.delete(Number(mark.label))
  emit('marker-changed')
}

function startEdit(mark: MarkerOptions) {
  idOfMarkerBeingEdited.value = mark.label
  editForm.value = {
    title: mark.title,
    lat: mark.position.lat,
    lng: mark.position.lng,
  }
}

function startCreate() {
  isCreating.value = true
  editForm.value = {
    title: '',
    lat: 0,
    lng: 0,
  }
}

async function deleteHalf() {
  await VesselApi.deleteHalf()
  emit('marker-changed')
}

function cancelEdit() {
  idOfMarkerBeingEdited.value = null
  isCreating.value = false
}

async function updateMarker() {
  if (!idOfMarkerBeingEdited.value) return

  const updatedVessel: Partial<Vessel> = {
    name: editForm.value.title,
    latitude: editForm.value.lat,
    longitude: editForm.value.lng,
  }

  await VesselApi.update(Number(idOfMarkerBeingEdited.value), updatedVessel)
  emit('marker-changed')
  idOfMarkerBeingEdited.value = null
}

async function createVessel() {
  const newVessel: Omit<Vessel, 'id' | 'updateTime'> = {
    name: editForm.value.title,
    latitude: editForm.value.lat,
    longitude: editForm.value.lng,
  }

  await VesselApi.create(newVessel)
  emit('marker-changed')
  isCreating.value = false
}
</script>

<template>
  <div class="controls">
    <input type="text" v-model="input" placeholder="Search vessels by name..." />
    <button @click="startCreate" class="create-btn">Create New Vessel</button>
    <button @click="deleteHalf" class="snap-btn">Oh Snap!</button>
  </div>

  <!-- Create Form // -->
  <div class="create-form" v-if="isCreating">
    <h3>Create New Vessel</h3>
    <input v-model="editForm.title" placeholder="Vessel name" />
    <div>
      <label>Lat:</label>
      <input type="number" v-model.number="editForm.lat" step="0.000001" />
      <label>Lng:</label>
      <input type="number" v-model.number="editForm.lng" step="0.000001" />
    </div>
    <button @click="createVessel">Create</button>
    <button @click="cancelEdit">Cancel</button>
  </div>

  <!-- Markers List -->
  <div class="markers-grid" v-if="filteredList().length">
    <div class="marker-card" v-for="mark in filteredList()" :key="mark.label">
      <template v-if="idOfMarkerBeingEdited === mark.label">
        <div class="edit-form">
          <h3>Edit Vessel</h3>
          <input v-model="editForm.title" />
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
          <div class="form-actions">
            <button @click="updateMarker">Save</button>
            <button @click="cancelEdit">Cancel</button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="marker-info">
          <h4>{{ mark.title }}</h4>
          <p>ID: {{ mark.label }}</p>
          <p>Lat: {{ mark.position.lat.toFixed(6) }}</p>
          <p>Lng: {{ mark.position.lng.toFixed(6) }}</p>
        </div>
        <div class="marker-actions">
          <button @click="startEdit(mark)">Edit</button>
          <button @click="deleteMarker(mark)">Delete</button>
        </div>
      </template>
    </div>
  </div>
  <div class="error-message" v-if="input && !filteredList().length">
    <p>No results found!</p>
  </div>
</template>

<style scoped>
@import '../styles/VesselList.css';
</style>
