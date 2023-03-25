<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useAuthStore } from '@/stores';
import router from './router';
import { computed } from 'vue';

const authStore = useAuthStore();

const user = computed(() => authStore.user);

if (!user.value) {
  router.push('/login');
}
</script>

<template>
  <div>
    <nav v-if="user" class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav">
        <RouterLink to="/" class="nav-item nav-link">Home</RouterLink>
        <a @click="authStore.logout()" class="nav-item nav-link">Logout</a>
      </div>
    </nav>
    <div class="container pt-4 pb-4">
      <RouterView />
    </div>
  </div>
</template>

<style>
.navbar {
  background-color: palegoldenrod;
  height: 45px;
}

.navbar-nav {
  display: flex;
  justify-content: space-between;
}

.nav-item {
  cursor: pointer;
  padding: 10px;
}
</style>