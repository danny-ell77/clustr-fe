<template>
  <div class="min-h-screen flex">
    <!-- Left Section: Forms -->
    <div class="w-full lg:w-1/2 flex flex-col p-8 bg-white overflow-y-auto">
      <div class="max-w-md w-full mx-auto">
        <div class="mb-8 flex-shrink-0">
          <h1 class="text-3xl text-gray-900">Welcome to ClustR!</h1>
          <p class="text-gray-600 mt-2">Let's get you set up.</p>
        </div>

        <!-- Carousel Stepper -->
        <div class="mb-8 relative flex-shrink-0">
          <div
            class="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div
            class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div class="overflow-hidden py-8">
            <div class="flex items-center gap-8 transition-transform duration-500 ease-in-out" :style="{
              transform: `translateX(calc(50% + ${translateX}px))`
            }">
              <div v-for="step in visibleSteps" :key="step.index"
                class="flex flex-col items-center transition-all duration-500 ease-in-out flex-shrink-0" :style="{
                  transform: `scale(${step.isCenter ? 1.3 : 0.85})`,
                  opacity: step.isCenter ? 1 : 0.5,
                  width: '120px'
                }">
                <div :class="[
                  'rounded-full flex items-center justify-center transition-all duration-500',
                  step.isCenter
                    ? 'bg-primary text-white w-17 h-17 text-2xl ring-4 ring-blue-200'
                    : step.index < currentStep - 1
                      ? 'bg-primary/100 text-white w-16 h-16 text-xl'
                      : 'bg-gray-300 text-gray-600 w-16 h-16 text-xl'
                ]">
                  <Icon v-if="step.index < currentStep - 1" name="check" class="w-6 h-6" />
                  <span v-else>{{ step.index + 1 }}</span>
                </div>

                <div :class="[
                  'mt-3 text-center transition-all duration-500 whitespace-nowrap px-2',
                  step.isCenter
                    ? 'text-gray-900 text-base font-semibold'
                    : 'text-gray-500 text-sm'
                ]">
                  {{ step.name }}
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-2 text-gray-500 text-sm">
            Step {{ currentStep }} of {{ steps.length }}
          </div>
        </div>

        <div class="flex-1 min-h-0">
          <Transition name="slide" mode="out-in">
            <component :is="currentFormComponent" @next="nextStep" @prev="prevStep" @skip="skipStep"
              v-bind="currentStepProps" />
          </Transition>
        </div>
      </div>
    </div>

    <!-- Right Section: Branding and Image -->
    <div class="hidden lg:flex lg:w-1/2 bg-cover bg-center items-center justify-center"
      :style="{ backgroundImage: `url('/images/onboarding_bg.jpeg')` }">
      <div
        class="text-center text-white bg-black/50 bg-opacity-50 p-8 rounded-lg h-full w-full flex flex-col items-center justify-center">
        <img src="/images/clustr_logo.png" alt="ClustR Logo" class="mx-auto mb-4 w-24 h-24" />
        <h2 class="text-4xl font-extrabold">ClustR</h2>
        <p class="text-lg mt-2">Property Management & Access Control</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EstateSignUpForm from '~/components/onboarding/EstateSignUpForm.vue'
import AdminProfileForm from '~/components/onboarding/AdminProfileForm.vue'
import DomainConfigForm from '~/components/onboarding/DomainConfigForm.vue'
import AddUserForm from '~/components/onboarding/AddUserForm.vue'
import ResidentImport from '~/components/onboarding/ResidentImport.vue'
import { definePageMeta, navigateTo } from '#imports'
import Icon from '~/components/Icon.vue'
import { Button } from '~/components/ui/button'

definePageMeta({
  auth: false,
  layout: false
})

const currentStep = ref(1)
const stepProps = ref({})

const steps = ['Facility', 'Profile', 'Domain', 'Add User', 'Import']

const components = [
  EstateSignUpForm,
  AdminProfileForm,
  DomainConfigForm,
  AddUserForm,
  ResidentImport
]

const currentFormComponent = computed(() => {
  return components[currentStep.value - 1]
})

const currentStepProps = computed(() => stepProps.value)

const visibleSteps = computed(() => {
  return steps.map((name, i) => ({
    index: i,
    name,
    isCenter: i === currentStep.value - 1
  }))
})

const translateX = computed(() => {
  const current = currentStep.value - 1
  const baseWidth = 120
  const gap = 32
  const centerScale = 1.3
  const sideScale = 0.85

  let offset = 0
  for (let i = 0; i < current; i++) {
    const scale = i === current - 1 ? sideScale : sideScale
    offset += (baseWidth * scale) + gap
  }

  offset += (baseWidth * centerScale) / 2

  return -offset
})

const nextStep = (props = {}) => {
  stepProps.value = props
  if (currentStep.value < components.length) {
    currentStep.value++
  } else {
    console.log('Onboarding complete!')
    navigateTo('/login')
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const skipStep = () => {
  nextStep()
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
