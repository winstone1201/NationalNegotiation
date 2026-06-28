<template>
  <div class="loading-screen" v-if="visible">
    <div class="loading-screen__icon">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="var(--color-border)" stroke-width="3"/>
        <path d="M24 4a20 20 0 0120 20" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 24 24"
            to="360 24 24"
            dur="1s"
            repeatCount="indefinite"/>
        </path>
      </svg>
    </div>
    <p class="loading-screen__text">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: true },
  message: { type: String, default: '加载中...' }
})
</script>

<style scoped>
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--spacing-xl);
}

.loading-screen__icon {
  color: var(--color-primary);
}

.loading-screen__text {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}
</style>
