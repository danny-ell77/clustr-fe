<template>
  <div class="min-h-screen flex">
    <!-- Left Section: Forms -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white max-h-screen overflow-y-auto">
      <div class="max-w-md w-full">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Welcome to ClustR!</h1>
          <p class="text-gray-600 mt-2">Let's get you set up.</p>
        </div>

        <!-- Step Indicator -->
        <div class="flex justify-between items-center mb-8 text-sm font-medium text-gray-500">
          <div :class="{'text-blue-600 font-semibold': currentStep === 1}">Estate Sign Up</div>
          <Icon name="chevron-right" class="w-4 h-4 text-gray-400"/>
          <div :class="{'text-blue-600 font-semibold': currentStep === 2}">Add Users</div>
          <Icon name="chevron-right" class="w-4 h-4 text-gray-400" />
          <div :class="{'text-blue-600 font-semibold': currentStep === 3}">Profile Picture</div>
        </div>

        <!-- Current Step Form -->
        <Transition name="fade" mode="out-in">
          <component :is="currentFormComponent" @next="nextStep" />
        </Transition>
      </div>
    </div>

    <!-- Right Section: Branding and Image -->
    <div class="hidden lg:flex lg:w-1/2 bg-cover bg-center items-center justify-center"
         :style="{ backgroundImage: `url('/images/onboarding_bg.jpeg')` }">
      <div class="text-center text-white bg-black/50 bg-opacity-50 p-8 rounded-lg h-full w-full">
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
import AddUserForm from '~/components/onboarding/AddUserForm.vue'
import ProfileUploadForm from '~/components/onboarding/ProfileUploadForm.vue'
import { definePageMeta, navigateTo } from '#imports'
import Icon from '~/components/Icon.vue'

// Disable default layout for onboarding page
definePageMeta({
  layout: false
})

const currentStep = ref(1)

const components = [
  EstateSignUpForm,
  AddUserForm,
  ProfileUploadForm
]

const currentFormComponent = computed(() => {
  return components[currentStep.value - 1]
})

const nextStep = () => {
  if (currentStep.value < components.length) {
    currentStep.value++
  } else {
    // Onboarding complete, navigate to dashboard or login
    console.log('Onboarding complete!')
    navigateTo('/') // Or '/login'
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
