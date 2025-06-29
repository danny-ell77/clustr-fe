<template>
  <div class="text-center space-y-6">
    <div class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
      <Icon name="rotate-ccw" class="w-8 h-8 text-blue-600" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900">Reset Password</h2>
    <p class="text-gray-600 text-sm">Enter your new password below.</p>
    
    <form @submit.prevent="handleResetPassword" class="space-y-4">
      <div class="relative">
        <Label for="new-password" class="sr-only">New Password</Label>
        <Input
          id="new-password"
          v-model="newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          placeholder="New Password"
          required
          class="pl-10"
        />
        <Icon name="lock" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <button type="button" @click="showNewPassword = !showNewPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon :name="showNewPassword ? 'eye-off' : 'eye'" class="w-4 h-4" />
        </button>
      </div>
      <div class="relative">
        <Label for="confirm-new-password" class="sr-only">Confirm New Password</Label>
        <Input
          id="confirm-new-password"
          v-model="confirmNewPassword"
          :type="showConfirmNewPassword ? 'text' : 'password'"
          placeholder="Confirm New Password"
          required
          class="pl-10"
        />
        <Icon name="lock" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <button type="button" @click="showConfirmNewPassword = !showConfirmNewPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon :name="showConfirmNewPassword ? 'eye-off' : 'eye'" class="w-4 h-4" />
        </button>
      </div>
      <Button type="submit" :disabled="isLoading" class="w-full bg-blue-600 text-white hover:bg-blue-700">
        <span v-if="isLoading">Resetting...</span>
        <span v-else>Reset Password</span>
      </Button>
    </form>

    <SuccessDialog :open="showSuccessDialog" @update:open="showSuccessDialog = $event" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { definePageMeta, navigateTo } from '#imports'



import Icon from '~/components/Icon.vue'
import SuccessDialog from '~/components/SuccessDialog.vue'

definePageMeta({
  layout: 'auth-layout'
})

const newPassword = ref('')
const confirmNewPassword = ref('')
const isLoading = ref(false)
const showNewPassword = ref(false)
const showConfirmNewPassword = ref(false)
const showSuccessDialog = ref(false)

async function handleResetPassword() {
  if (newPassword.value !== confirmNewPassword.value) {
    alert('Passwords do not match!')
    return
  }

  isLoading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  console.log('Password reset for:', newPassword.value)
  isLoading.value = false
  showSuccessDialog.value = true
  
  // Optionally redirect after a short delay
  setTimeout(() => {
    navigateTo('/login')
  }, 2000)
}
</script>
