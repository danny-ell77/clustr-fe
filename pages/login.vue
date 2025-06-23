<template>
  <div>
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Sign in to your account
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Property Management System
    </p>
    <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
      <div class="rounded-md shadow-sm space-y-2">
        <div class="relative">
          <label for="email" class="sr-only">Email address</label>
          <Input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pl-10"
            placeholder="Email address"
          />
          <Icon name="mail" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        <div class="relative">
          <label for="password" class="sr-only">Password</label>
          <Input
            id="password"
            v-model="form.password"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pl-10"
            placeholder="Password"
          />
          <Icon name="lock" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon :name="showPassword ? 'eye-off' : 'eye'" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-end">
        <div class="text-sm">
          <NuxtLink to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
            Forgot password?
          </NuxtLink>
        </div>
      </div>

      <div v-if="error" class="text-red-600 text-sm text-center">
        {{ error }}
      </div>

      <div>
        <Button
          type="submit"
          :disabled="isLoading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign in</span>
        </Button>
      </div>
      
      <p class="mt-2 text-center text-sm text-gray-600">
        Don't have an account? <NuxtLink to="/onboarding" class="font-medium text-blue-600 hover:text-blue-500">Sign Up</NuxtLink>
      </p>

      <!-- Demo Credentials -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 class="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
        <div class="text-xs text-blue-700 space-y-1">
          <p><strong>Admin:</strong> admin@demo.com / admin123</p>
          <p><strong>Manager:</strong> manager@demo.com / manager123</p>
          <p><strong>User:</strong> user@demo.com / user123</p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/modules/core/runtime/composables/useAuth'
import { definePageMeta, navigateTo } from '#imports'
import Input from '~/components/ui/input'
import Button from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import { NuxtLink } from '#components'

// Use the new auth-layout
definePageMeta({
  layout: 'auth-layout'
})

const { login } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  error.value = ''
  isLoading.value = true
  
  try {
    const result = await login(form.value.email, form.value.password)
    
    if (result.success) {
      await navigateTo('/')
    } else {
      error.value = result.error || 'Login failed'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    isLoading.value = false
  }
}
</script>
