<template>
  <div>
    <h2 class="mt-6 text-center text-3xl font-semibold text-gray-900">
      Sign in to your account
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Property Management System
    </p>
    <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
      <div class="rounded-md shadow-sm space-y-2">
        <div class="relative">
          <label for="email" class="sr-only">Email address</label>
          <Input id="email" v-model="form.email" name="email" type="email" autocomplete="email" required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus: border-primary focus:z-10 sm:text-sm pl-10"
            placeholder="Email address" />
          <Icon name="mail" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        <div class="relative">
          <label for="password" class="sr-only">Password</label>
          <Input id="password" v-model="form.password" name="password" :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password" required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus: border-primary focus:z-10 sm:text-sm pl-10"
            placeholder="Password" />
          <Icon name="lock" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon :name="showPassword ? 'eye-off' : 'eye'" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="remember-me" v-model="form.rememberMe" name="remember-me" type="checkbox"
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>
        <div class="text-sm">
          <NuxtLink to="/forgot-password" class="font-medium text-primary hover:text-primary">
            Forgot password?
          </NuxtLink>
        </div>
      </div>

      <div v-if="error" class="text-red-600 text-sm text-center">
        {{ error }}
      </div>

      <div>
        <button type="submit" :disabled="isLoading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign in</span>
        </button>
      </div>

      <p class="mt-2 text-center text-sm text-gray-600">
        Don't have an account? <NuxtLink to="/onboarding" class="font-medium text-primary hover:text-primary">Sign Up
        </NuxtLink>
      </p>

      <!-- Demo Credentials -->
      <div class="mt-6 p-4 bg-primary/10 rounded-lg">
        <h3 class="text-sm font-medium text-primary mb-2">Demo Credentials:</h3>
        <div class="text-xs text-primary space-y-1">
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
import { useAuth } from '~/composables/auth/useAuth'
import { definePageMeta, navigateTo } from '#imports'
import Icon from '~/components/Icon.vue'
import { NuxtLink } from '#components'
import { Input } from '~/components/ui/input'
definePageMeta({
  auth: false,
  layout: 'auth-layout'
})

const { login } = useAuth()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  console.log('Attempting login with', form.value)
  error.value = ''
  isLoading.value = true

  try {
    const data = {
      emailAddress: form.value.email,
      password: form.value.password,
      rememberMe: form.value.rememberMe
    }
    const result = await login(data)

    if (result.success) {
      // Redirect is handled in useAuth
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
