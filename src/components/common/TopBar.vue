<template>
  <header class="topbar" :class="{ 'topbar--transparent': transparent }">
    <button class="topbar__back" v-if="showBack" @click="goBack" aria-label="返回">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="topbar__title" v-if="title">
      <span>{{ title }}</span>
    </div>

    <div class="topbar__right">
      <slot name="right" />
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
  transparent: { type: Boolean, default: false }
})

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 var(--spacing-base);
  background: var(--color-bg-white);
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: var(--z-dropdown);
}

.topbar::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), transparent 60%);
  opacity: 0.3;
}

.topbar--transparent {
  background: transparent;
  border-bottom: none;
}

.topbar--transparent::after {
  display: none;
}

.topbar__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.topbar__back:active {
  background: var(--color-border-light);
}

.topbar__title {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-right: 32px; /* 平衡返回按钮宽度 */
}

.topbar__right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
