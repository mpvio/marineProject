<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Google Map</RouterLink>
      <RouterLink to="/vueInfo">Vue Info</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}

nav {
  display: flex;
  gap: 1rem; /* Space between links */
}

nav a {
  text-decoration: none;
  font-size: 0.85rem;
  color: #007bff;
}

nav a.router-link-exact-active {
  font-weight: bold; /* Highlight active link */
}

main {
  padding: 1rem; /* Add padding for content below the nav bar */
}
</style>
