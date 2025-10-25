<script setup>

import { RouterView } from 'vue-router';
import HearderLayout from './layout/HearderLayout.vue';
</script>

<template>
  <div class="app-container">
    <HearderLayout/>
    <main class="main-content">
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
  margin-left: 280px; /* Bằng chiều rộng sidebar */
  padding: 20px;
  width: calc(100% - 280px);
  background-color: #fff;
  padding-left: 50px;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    width: 100%;
  }
}
</style>