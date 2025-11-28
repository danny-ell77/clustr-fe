<template>
  <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-900">Configure Your Domain</h3>
      <p class="text-sm text-gray-600">
        This will be your unique ClustR URL. You can use letters, numbers, and hyphens.
      </p>

      <div>
        <Label class="text-sm font-medium text-gray-700">Subdomain</Label>
        <div class="flex items-center gap-0">
          <Input id="subdomain" v-model="subdomain.value.value" :error="subdomain.errors.value[0]"
            :touched="subdomain.isTouched.value" @blur="subdomain.setTouched()" class="rounded-r-none border-r-0"
            placeholder="your-estate" />
          <span
            class="px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-gray-500 text-sm h-9 flex items-center">
            .clustr.com
          </span>
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <Button type="button" variant="outline" @click="$emit('prev')" class="flex-1">
        Back
      </Button>
      <Button type="submit" @click="handleSubmit" :disabled="!isValid"
        class="flex-1 bg-primary hover:bg-primary/90 text-white">
        Continue
      </Button>
    </div>
    <div class="text-center">
      <p class="text-xs">Skip for Now</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { useFieldValidation } from '~/composables/useFieldValidation'
import { rules } from '~/utils/validators'
import { useClusterSignup } from '~/composables/useClusterSignup'

const emit = defineEmits(['next', 'skip', 'prev'])

const props = defineProps<{
  defaultSubdomain?: string
}>()

const { saveDomainConfig, submitClusterSignup } = useClusterSignup()

const isValidSubdomain = (value: string) => {
  const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return pattern.test(value)
}

const subdomain = useFieldValidation(props.defaultSubdomain || '', [
  rules.required('Subdomain is required'),
  rules.minLength(3, 'Subdomain must be at least 3 characters'),
  rules.maxLength(63, 'Subdomain cannot exceed 63 characters'),
  rules.custom(isValidSubdomain, 'Only use lowercase letters, numbers, and hyphens')
])

const isValid = computed(() => subdomain.isValid.value)

const handleSubmit = async () => {
  subdomain.setTouched()

  if (!isValid.value) return

  try {
    saveDomainConfig({ subdomain: subdomain.value.value })

    await submitClusterSignup()

    emit('next')
  } catch (error) {
    console.error('Cluster signup failed:', error)
  }
}
</script>