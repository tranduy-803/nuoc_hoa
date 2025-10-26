<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import HearderLayout from './layout/HearderLayout.vue'
import { authService } from './services/authService'

const route = useRoute()

// Only show sidebar when not on login page
const showSidebar = computed(() => {
  return route.path !== '/login' && authService.isAuthenticated()
})
</script>

<template>
  <div class="app-container">
    <HearderLayout v-if="showSidebar" />
    <main class="main-content" :class="{ 'with-sidebar': showSidebar }">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  transition: all 0.3s ease;
}

.main-content.with-sidebar {
  margin-left: 302px; /* Bằng chiều rộng sidebar + border */
  padding: 0;
  width: calc(100% - 302px);
  background-color: #fff;
}

/* Login page without sidebar */
.main-content:not(.with-sidebar) {
  width: 100%;
  margin-left: 0;
  padding: 0;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .main-content.with-sidebar {
    margin-left: 0;
    width: 100%;
  }
}
</style>
