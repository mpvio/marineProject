<script setup lang="ts">
import type { MarkerOptions } from '@/requests/models/markerOptions'
import { ref } from 'vue'

// eslint-disable-next-line prefer-const
let input = ref('')

const props = defineProps<{
  markers: MarkerOptions[]
}>()

function filteredList() {
  return props.markers.filter((mark) =>
    mark.title.toLowerCase().includes(input.value.toLowerCase()),
  )
}
</script>

<template>
  <input type="text" v-model="input" placeholder="Search vessels by name..." />
  <div class="wrapper" v-if="filteredList().length">
    <div class="marker item" v-for="mark in filteredList()" :key="mark.label">
      <p>
        {{ mark.label }}: {{ mark.title }} at ({{ mark.position.lat }}, {{ mark.position.lng }})
      </p>
    </div>
  </div>
  <div class="error item" v-if="input && !filteredList().length">
    <p>No results!</p>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}

/* body {
  padding: 20px;
  min-height: 100vh;
  background-color: rgb(234, 242, 255);
} */

input {
  display: block;
  width: 350px;
  margin: 20px auto;
  padding: 10px 45px;
  background: white url('assets/search-icon.svg') no-repeat 15px center;
  background-size: 15px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.item {
  width: 350px;
  margin: 0 auto 10px auto;
  padding: 10px 20px;
  color: white;
  border-radius: 5px;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.marker {
  background-color: rgb(97, 62, 252);
  cursor: pointer;
}

.error {
  background-color: tomato;
}
</style>
