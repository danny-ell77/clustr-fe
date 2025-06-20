<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="relative">
      <Label for="estate-plan" class="sr-only">Estate Plan</Label>
      <Input id="estate-plan" v-model="form.estatePlan" placeholder="Estate plan" required />
      <Icon name="building" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
    <div class="relative">
      <Label for="estate-name" class="sr-only">Estate Name</Label>
      <Input id="estate-name" v-model="form.estateName" placeholder="Estate Name" required />
      <Icon name="home" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
    <div class="relative">
      <Label for="email" class="sr-only">Email</Label>
      <Input id="email" v-model="form.email" type="email" placeholder="Email" required />
      <Icon name="mail" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
    <div class="relative">
      <Label for="password" class="sr-only">Password</Label>
      <Input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Password" required />
      <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon :name="showPassword ? 'eye-off' : 'eye'" class="w-4 h-4" />
      </button>
    </div>
    <div class="relative">
      <Label for="confirm-password" class="sr-only">Confirm Password</Label>
      <Input id="confirm-password" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm Password" required />
      <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon :name="showConfirmPassword ? 'eye-off' : 'eye'" class="w-4 h-4" />
      </button>
    </div>
    <div class="relative">
      <Label for="clustr-domain" class="sr-only">Clustr.com</Label>
      <Input id="clustr-domain" v-model="form.clustrDomain" placeholder="Clustr.com" required />
      <Icon name="globe" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>

    <Button type="submit" class="w-full bg-blue-600 text-white hover:bg-blue-700">Sign Up</Button>
    <p class="text-center text-sm text-gray-600">
      Already have an account? <NuxtLink to="/login" class="text-blue-600 hover:underline">Login</NuxtLink>
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { NuxtLink } from '#components'
import Icon from '~/components/Icon.vue'

const emit = defineEmits(['next'])

const form = ref({
  estatePlan: '',
  estateName: '',
  email: '',
  password: '',
  confirmPassword: '',
  clustrDomain: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleSubmit = () => {
  // Basic validation
  if (form.value.password !== form.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }
  console.log('Estate Sign Up Form Submitted:', form.value)
  emit('next')
}
</script>
