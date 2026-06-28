<template>
  <div class="quiz-view">
    <TopBar title="知识测验" />

    <!-- 未开始 / 已完成选择 -->
    <div class="quiz-view__intro" v-if="!quizStarted && !quizFinished">
      <div class="quiz-view__intro-icon">{{ quizDone ? '✅' : '📋' }}</div>
      <h2 class="quiz-view__intro-title">国谈政策知识测验</h2>
      <p class="quiz-view__intro-desc">
        {{ quizDone
          ? `你已完成测验，得分 ${gameStore.quizState.score} 分。要重新挑战吗？`
          : '5道选择题，测试你对国家医保谈判政策的了解程度。'
        }}
      </p>
      <button class="quiz-view__start-btn" @click="startQuiz">
        {{ quizDone ? '重新挑战' : '开始测验' }}
      </button>
    </div>

    <!-- 答题中 -->
    <div class="quiz-view__questions" v-if="quizStarted && !quizFinished">
      <div class="quiz-view__progress">
        <div class="quiz-view__progress-bar">
          <div
            class="quiz-view__progress-fill"
            :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }"
          ></div>
        </div>
        <span class="quiz-view__progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</span>
      </div>

      <div class="quiz-view__question-card" v-if="currentQuestion">
        <h3 class="quiz-view__question-text">{{ currentQuestion.question }}</h3>

        <div class="quiz-view__options">
          <button
            v-for="option in currentQuestion.options"
            :key="option.id"
            class="quiz-view__option"
            :class="{
              'quiz-view__option--selected': selectedOption === option.id,
              'quiz-view__option--correct': showAnswer && option.id === currentQuestion.correct,
              'quiz-view__option--wrong': showAnswer && selectedOption === option.id && option.id !== currentQuestion.correct
            }"
            :disabled="showAnswer"
            @click="selectOption(option.id)"
          >
            <span class="quiz-view__option-marker">{{ option.id.toUpperCase() }}</span>
            <span class="quiz-view__option-text">{{ option.text }}</span>
          </button>
        </div>

        <div class="quiz-view__explanation" v-if="showAnswer">
          <div class="quiz-view__explanation-header">
            {{ selectedOption === currentQuestion.correct ? '✅ 回答正确！' : '❌ 回答错误' }}
          </div>
          <p class="quiz-view__explanation-text">{{ currentQuestion.explanation }}</p>
          <button class="quiz-view__next-btn" @click="nextQuestion">
            {{ currentIndex < questions.length - 1 ? '下一题' : '查看结果' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 结果页 -->
    <div class="quiz-view__result" v-if="quizFinished">
      <div class="quiz-view__result-icon">{{ score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚' }}</div>
      <h2 class="quiz-view__result-score">{{ score }} 分</h2>
      <p class="quiz-view__result-label">
        {{ score >= 80 ? '非常棒！你对国谈政策了如指掌' : score >= 60 ? '不错，还有一些提升空间' : '继续学习，国谈知识值得深入了解' }}
      </p>

      <div class="quiz-view__result-actions">
        <button class="quiz-view__btn quiz-view__btn--retry" @click="startQuiz">再试一次</button>
        <button class="quiz-view__btn quiz-view__btn--home" @click="goHome">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { getRandomQuestions, calculateScore } from '@/data/quiz-questions'
import { trackEvent, EventType } from '@/utils/analytics'
import TopBar from '@/components/common/TopBar.vue'

const router = useRouter()
const gameStore = useGameStore()

const quizStarted = ref(false)
const quizFinished = ref(false)
const questions = ref([])
const currentIndex = ref(0)
const selectedOption = ref(null)
const showAnswer = ref(false)
const answers = ref({})
const score = ref(0)

const quizDone = computed(() => gameStore.quizState.completed)
const currentQuestion = computed(() => questions.value[currentIndex.value] || null)

function startQuiz() {
  questions.value = getRandomQuestions(5)
  currentIndex.value = 0
  selectedOption.value = null
  showAnswer.value = false
  answers.value = {}
  score.value = 0
  quizStarted.value = true
  quizFinished.value = false
  trackEvent(EventType.QUIZ_START, {})
}

function selectOption(optionId) {
  if (showAnswer.value) return
  selectedOption.value = optionId
  showAnswer.value = true
}

function nextQuestion() {
  if (!currentQuestion.value) return
  answers.value[currentQuestion.value.id] = selectedOption.value

  const isLast = currentIndex.value >= questions.value.length - 1
  if (isLast) {
    score.value = calculateScore(answers.value)
    gameStore.completeQuiz(score.value)
    quizStarted.value = false
    quizFinished.value = true
    trackEvent(EventType.QUIZ_COMPLETE, { score: score.value })
  } else {
    currentIndex.value++
    selectedOption.value = null
    showAnswer.value = false
  }
}

function goHome() {
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.quiz-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

/* === 介绍页 === */
.quiz-view__intro {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
}

.quiz-view__intro-icon { font-size: 48px; margin-bottom: var(--spacing-lg); }

.quiz-view__intro-title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  margin-bottom: var(--spacing-sm);
}

.quiz-view__intro-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  max-width: 300px;
  margin-bottom: var(--spacing-2xl);
}

.quiz-view__start-btn {
  padding: 14px 48px;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-size-md);
  font-weight: 700;
  border-radius: 24px;
  box-shadow: 0 4px 16px rgba(181, 52, 58, 0.25);
}

/* === 答题中 === */
.quiz-view__questions {
  flex: 1;
  padding: var(--spacing-lg) var(--spacing-base);
}

.quiz-view__progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.quiz-view__progress-bar {
  flex: 1;
  height: 4px;
  background: var(--color-border-light);
  border-radius: 2px;
  overflow: hidden;
}

.quiz-view__progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.quiz-view__progress-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-family: var(--font-family-number);
}

.quiz-view__question-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.quiz-view__question-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-xl);
}

.quiz-view__options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.quiz-view__option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1.5px solid var(--color-border-light);
  border-radius: var(--radius-base);
  text-align: left;
  transition: all var(--transition-fast);
  background: var(--color-bg-white);
}

.quiz-view__option:not(:disabled):active {
  border-color: var(--color-primary);
  background: var(--color-primary-ghost);
}

.quiz-view__option--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-ghost);
}

.quiz-view__option--correct {
  border-color: var(--color-success) !important;
  background: #e8f5e9 !important;
}

.quiz-view__option--wrong {
  border-color: var(--color-danger) !important;
  background: #fce4ec !important;
}

.quiz-view__option-marker {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-bg);
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.quiz-view__option-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
}

.quiz-view__explanation {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg);
  border-radius: var(--radius-base);
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.quiz-view__explanation-header {
  font-size: var(--font-size-md);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.quiz-view__explanation-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}

.quiz-view__next-btn {
  width: 100%;
  padding: 12px;
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-md);
  font-weight: 600;
  border-radius: var(--radius-base);
}

/* === 结果 === */
.quiz-view__result {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
}

.quiz-view__result-icon { font-size: 56px; margin-bottom: var(--spacing-md); }

.quiz-view__result-score {
  font-size: 56px;
  font-weight: 800;
  color: var(--color-primary);
  font-family: var(--font-family-number);
}

.quiz-view__result-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-2xl);
  max-width: 260px;
}

.quiz-view__result-actions {
  display: flex;
  gap: var(--spacing-md);
}

.quiz-view__btn {
  padding: 12px 28px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  border-radius: var(--radius-base);
}

.quiz-view__btn--retry {
  background: var(--color-bg);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.quiz-view__btn--home {
  background: var(--color-primary);
  color: #fff;
}
</style>
