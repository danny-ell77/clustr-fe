<template>
  <div class="flex flex-col items-center justify-center h-full p-6">
    <img src="/placeholder.svg?height=300&width=400" alt="404 Error Illustration" class="max-w-full h-auto mb-8" />
    <h1 class="text-4xl font-bold text-gray-900 mb-4">ERROR - PAGE NOT FOUND!</h1>
    <p class="text-lg text-gray-600 mb-8">The page you are looking for does not exist.</p>
    <Button @click="handleBack" class="bg-blue-600 text-white hover:bg-blue-700">
      Back
    </Button>
  </div>
</template>

<script setup>
import { definePageMeta, navigateTo, clearError } from '#imports'
import Button from '~/components/ui/button'

// This page will automatically use the default layout due to Nuxt's error handling
// No explicit layout definition needed here.

const props = defineProps({
  error: Object // Nuxt provides an error object to this page
})

const handleBack = () => {
  // Clear the error and navigate to the home page
  clearError({ redirect: '/' })
}
</script>
