<template>
  <div class="text-center space-y-6">
    <div class="w-16 h-16 mx-auto bg-primary/15 rounded-full flex items-center justify-center">
      <Icon name="lock" class="w-8 h-8 text-primary" />
    </div>
    <h2 class="text-2xl text-gray-900">Forgot Password?</h2>
    <p class="text-gray-600 text-sm">Enter your email address to receive a reset link.</p>

    <form @submit.prevent="handleForgotPassword" class="space-y-4">
      <div class="relative">
        <Label for="email" class="sr-only">Email address</Label>
        <Input id="email" v-model="email" type="email" placeholder="Email address" required class="pl-10" />
        <Icon name="mail" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
      <Button type="submit" :disabled="isLoading" class="w-full bg-primary text-white hover:bg-primary/90">
        <span v-if="isLoading">Sending...</span>
        <span v-else">Send Reset Link</span>
      </Button>
    </form>
    <p class="text-sm text-gray-600">
      Remember your password? <NuxtLink to="/login" class="text-primary hover:underline">Login</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { definePageMeta, navigateTo } from '#imports'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import { NuxtLink } from '#components'

definePageMeta({
  auth: false,
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
