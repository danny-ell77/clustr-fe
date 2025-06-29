<template>
  <div class="text-center space-y-6">
    <div class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
      <Icon name="lock" class="w-8 h-8 text-blue-600" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900">Forgot Password?</h2>
    <p class="text-gray-600 text-sm">Enter your email address to receive a reset link.</p>
    
    <form @submit.prevent="handleForgotPassword" class="space-y-4">
      <div class="relative">
        <Label for="email" class="sr-only">Email address</Label>
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="Email address"
          required
          class="pl-10"
        />
        <Icon name="mail" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
      <Button type="submit" :disabled="isLoading" class="w-full bg-blue-600 text-white hover:bg-blue-700">
        <span v-if="isLoading">Sending...</span>
        <span v-else>Send Reset Link</span>
      </Button>
    </form>
    <p class="text-sm text-gray-600">
      Remember your password? <NuxtLink to="/login" class="text-blue-600 hover:underline">Login</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { definePageMeta, navigateTo } from '#imports'



import Icon from '~/components/Icon.vue'
import { NuxtLink } from '#components'

definePageMeta({
  layout: 'auth-layout'
})

const email = ref('')
const isLoading = ref(false)

async function handleForgotPassword() {
  isLoading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  console.log('Forgot password request for:', email.value)
  alert('Password reset link sent to your email!')
  isLoading.value = false
  navigateTo('/login') // Redirect to login after sending link
}
</script>
