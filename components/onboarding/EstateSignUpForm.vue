<template>
  <div class="grid place-items-center min-h-screen">
    <div class="max-w-md w-full p-8 bg-white rounded-lg shadow">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <h3 class="text-lg font-medium mb-2">Tell us about your Facility</h3>

          <div>
            <Label>What kind of Facility do you manage?</Label>
            <Select 
              v-model="estateType.value"
              @blur="estateType.setTouched"
            >
              <SelectTrigger :class="{ 'border-red-500': estateType.hasError && estateType.touched }">
                <SelectValue placeholder="Select facility type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ESTATE">Estate</SelectItem>
                <SelectItem value="FACILITY">Facility</SelectItem>
                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                <SelectItem value="MIXED_USE">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
            <FormError :error="estateType.errorMessage" />
          </div>
          
          <div>
            <Label>Facility Name</Label>
            <Input
              type="text"
              v-model="estateName.value"
              :class="{ 'border-red-500': estateName.hasError && estateName.touched }"
              placeholder="Enter your facility name"
              @blur="estateName.setTouched"
            />
            <FormError :error="estateName.errorMessage" />
          </div>

          <hr class="my-6 border-t" />
          <h3 class="text-lg font-medium mb-2">Setup your profile</h3>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              v-model="email.value"
              :class="{ 'border-red-500': email.hasError && email.touched }"
              placeholder="Enter your email"
              @blur="email.setTouched"
            />
            <FormError :error="email.errorMessage" />
          </div>

          <div>
            <Label>Password</Label>
            <div class="relative">
              <Input
                :type="showPassword ? 'text' : 'password'"
                v-model="password.value"
                :class="{ 'border-red-500': password.hasError && password.touched }"
                placeholder="Enter your password"
                @blur="password.setTouched"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <Icon 
                  :name="showPassword ? 'eye-off' : 'eye'" 
                  class="h-4 w-4"
                />
              </Button>
            </div>
            <FormError :error="password.errorMessage" />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <div class="relative">
              <Input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword.value"
                :class="{ 'border-red-500': confirmPassword.hasError && confirmPassword.touched }"
                placeholder="Confirm your password"
                @blur="confirmPassword.setTouched"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <Icon 
                  :name="showConfirmPassword ? 'eye-off' : 'eye'" 
                  class="h-4 w-4"
                />
              </Button>
            </div>
            <FormError :error="confirmPassword.errorMessage" />
          </div>
        </div>

        <div class="mt-6">
          <Button
            type="submit"
            class="w-full"
            :variant="isFormValid ? 'default' : 'secondary'"
            :disabled="!isFormValid"
            @click="handleSubmit"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { FormError } from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import Icon from '~/components/Icon.vue'
import { useFieldValidation } from '~/composables/useFieldValidation'
import { rules } from '~/utils/validators'
import { useClusterSignup } from '~/composables/useClusterSignup'

const emit = defineEmits(['next'])

const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Field validations
const estateName = useFieldValidation('', [
  rules.required('Estate name is required'),
  rules.minLength(3, 'Estate name must be at least 3 characters'),
  rules.maxLength(255, 'Estate name cannot exceed 255 characters'),
  rules.genericName('Please enter a valid estate name')
])

const estateType = useFieldValidation('ESTATE', [
  rules.required('Estate type is required'),
  rules.custom(
    (value) => ['ESTATE', 'FACILITY', 'COMMERCIAL', 'MIXED_USE'].includes(value),
    'Invalid estate type'
  )
])

const email = useFieldValidation('', [
  rules.required('Email is required'),
  rules.email('Please enter a valid email address')
])

const password = useFieldValidation('', [
  rules.required('Password is required'),
  rules.password('Password must meet security requirements')
])

const confirmPassword = useFieldValidation('', [
  rules.required('Please confirm your password'),
  rules.custom(
    (value) => value === password.value,
    'Passwords must match'
  )
])

// Form-level validation
const isFormValid = computed(() =>
  estateName.isValid &&
  estateType.isValid &&
  email.isValid &&
  password.isValid &&
  confirmPassword.isValid
)

const { saveEstateInfo, slugifyDomain } = useClusterSignup()

const handleSubmit = () => {
  // Mark all fields as touched to show validation errors
  const fields = [estateName, estateType, email, password, confirmPassword]
  fields.forEach(field => field.setTouched())

  if (!isFormValid.value) return

  // Prepare data according to ClusterAdminAccount structure
  const clusterData = {
    name: estateName.value,
    type: estateType.value,
    admin: {
      email_address: email.value,
      password: password.value,
      name: '', // We'll add admin name field
      phone_number: '', // We'll add phone number field
    }
  }

  // Save estate info in the composable state
  saveEstateInfo(clusterData)

  // Pass the slugified domain as initial value for the domain config step
  emit('next', { defaultSubdomain: slugifyDomain(estateName.value) })
}
</script>
