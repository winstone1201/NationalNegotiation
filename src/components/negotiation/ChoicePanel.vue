<template>
  <div class="choice-panel" v-if="options.length > 0">
    <p class="choice-panel__prompt">{{ prompt }}</p>

    <div class="choice-panel__options">
      <button
        v-for="option in options"
        :key="option.id"
        class="choice-btn"
        :class="'choice-btn--' + option.type"
        :disabled="disabled"
        @click="selectOption(option)"
      >
        <div class="choice-btn__header">
          <span class="choice-btn__type-badge" :class="'choice-btn__type-badge--' + option.type">
            {{ option.label }}
          </span>
          <span class="choice-btn__shortcut">{{ option.id }}</span>
        </div>
        <p class="choice-btn__text">{{ option.text }}</p>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  options: {
    type: Array,
    default: () => []
    // Each: { id, type, label, text }
  },
  prompt: {
    type: String,
    default: '请选择你的谈判策略：'
  },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['choose'])

function selectOption(option) {
  emit('choose', option)
}
</script>

<style scoped>
.choice-panel {
  padding: var(--spacing-lg) var(--spacing-base);
  background: var(--color-bg);
  border-top: 2px solid var(--color-border);
}

.choice-panel__prompt {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.choice-panel__options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* 选项按钮 */
.choice-btn {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-white);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-base);
  text-align: left;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.choice-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.choice-btn:not(:disabled):active {
  transform: scale(0.98);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-base);
}

/* 策略类型配色 */
.choice-btn--pressure {
  border-left: 3px solid var(--color-pressure);
}

.choice-btn--empathy {
  border-left: 3px solid var(--color-empathy);
}

.choice-btn--technical {
  border-left: 3px solid var(--color-technical);
}

.choice-btn__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.choice-btn__type-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  letter-spacing: 0.5px;
}

.choice-btn__type-badge--pressure {
  background: #fce4ec;
  color: #c62828;
}

.choice-btn__type-badge--empathy {
  background: #fff3e0;
  color: #e65100;
}

.choice-btn__type-badge--technical {
  background: #e8f5e9;
  color: #2e7d32;
}

.choice-btn__shortcut {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-family: var(--font-family-number);
}

.choice-btn__text {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
}
</style>
