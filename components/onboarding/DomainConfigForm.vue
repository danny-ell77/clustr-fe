<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Configure Your Domain</h2>
    
    <div class="space-y-4">
      <div class="flex items-center">
        <Input 
          id="subdomain" 
          v-model="subdomain.value"
          :error="subdomain.errors[0]"
          :touched="subdomain.isTouched"
          @blur="subdomain.setTouched()"
          class="rounded-r-none border-r-0"
          placeholder="your-estate"
        />
        <span class="px-3 py-2 bg-gray-50 border border-l-0 border-input rounded-r-md text-gray-500">
          .clustr.com
        </span>
      </div>
      <p class="text-sm text-gray-500">
        This will be your unique ClustR URL. You can use letters, numbers, and hyphens.
      </p>
    </div>

    <div class="flex justify-between gap-4">
      <Button 
        type="button" 
        variant="outline" 
        class="flex-1" 
        @click="$emit('next')"
      >
        Skip for now
      </Button>
      <Button 
        type="submit" 
        class="flex-1" 
        :variant="isValid ? 'default' : 'secondary'"
        :disabled="!isValid"
        @click="handleSubmit"
      >
        Continue
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { useFieldValidation } from '~/composables/useFieldValidation'
import { rules } from '~/utils/validators'
import { useClusterSignup } from '~/composables/useClusterSignup'

const emit = defineEmits(['next', 'skip'])

const props = defineProps<{
  defaultSubdomain?: string
}>()

const { saveDomainConfig, submitClusterSignup } = useClusterSignup()

// Custom validator for subdomain format
const isValidSubdomain = (value: string) => {
  const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return pattern.test(value)
}

// Field validation
const subdomain = useFieldValidation(props.defaultSubdomain || '', [
  rules.required('Subdomain is required'),
  rules.minLength(3, 'Subdomain must be at least 3 characters'),
  rules.maxLength(63, 'Subdomain cannot exceed 63 characters'),
  rules.custom(isValidSubdomain, 'Only use lowercase letters, numbers, and hyphens')
])

const isValid = computed(() => subdomain.isValid)

const handleSubmit = async () => {
  subdomain.setTouched()
  
  if (!isValid.value) return

  try {
    // Save domain configuration
    saveDomainConfig({ subdomain: subdomain.value })
    
    // Submit cluster signup
    await submitClusterSignup()
    
    // Move to next step
    emit('next')
  } catch (error) {
    console.error('Cluster signup failed:', error)
    // You might want to show an error message to the user here
  }
}
</script>