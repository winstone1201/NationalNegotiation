<template>
  <div class="app-container">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'page'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

onMounted(() => {
  // 从 localStorage 恢复游戏进度
  gameStore.restoreProgress()
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
}
</style>
