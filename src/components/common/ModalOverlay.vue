<template>
  <transition name="fade">
    <div class="modal-overlay" v-if="visible" @click.self="onClose">
      <transition name="slide-up">
        <div class="modal-overlay__content" v-if="visible" :style="{ maxWidth: maxWidth }">
          <div class="modal-overlay__header" v-if="title || $slots.header">
            <h3 class="modal-overlay__title">{{ title }}</h3>
            <button class="modal-overlay__close" @click="onClose" aria-label="关闭">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-overlay__body">
            <slot />
          </div>
          <div class="modal-overlay__footer" v-if="$slots.footer">
            <slot name="footer" />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  maxWidth: { type: String, default: '360px' }
})

const emit = defineEmits(['close'])

function onClose() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-bg-overlay);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-xl);
}

.modal-overlay__content {
  width: 100%;
  background: var(--color-bg-white);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  overflow: hidden;
  animation: slideInUp 0.3s var(--ease-out-expo);
}

@keyframes slideInUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-overlay__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-overlay__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
}

.modal-overlay__close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  border-radius: var(--radius-sm);
}

.modal-overlay__body {
  padding: var(--spacing-xl);
  max-height: 60vh;
  overflow-y: auto;
}

.modal-overlay__footer {
  padding: var(--spacing-base) var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
}
</style>
