<template>
    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="space-y-4">
            <div>
                <h3 class="text-xl font-semibold text-gray-900">Setup your profile</h3>
                <p class="text-sm text-gray-600 mt-1">Create your admin account to manage your facility</p>
            </div>

            <div>
                <Label for="admin-name" class="text-sm font-medium text-gray-700">Full Name</Label>
                <Input id="admin-name" type="text" v-model="adminName.value.value" :error="adminName.errors.value[0]"
                    :touched="adminName.isTouched.value" placeholder="Enter your full name"
                    @blur="adminName.setTouched()" />
            </div>

            <div>
                <Label for="phone-number" class="text-sm font-medium text-gray-700">Phone Number</Label>
                <Input id="phone-number" type="tel" v-model="phoneNumber.value.value"
                    :error="phoneNumber.errors.value[0]" :touched="phoneNumber.isTouched.value"
                    placeholder="Enter your phone number" @blur="phoneNumber.setTouched()" />
            </div>

            <div>
                <Label for="email" class="text-sm font-medium text-gray-700">Email</Label>
                <Input id="email" type="email" v-model="email.value.value" :error="email.errors.value[0]"
                    :touched="email.isTouched.value" placeholder="Enter your email" @blur="email.setTouched()" />
            </div>

            <div>
                <Label for="password" class="text-sm font-medium text-gray-700">Password</Label>
                <div class="relative">
                    <Input id="password" :type="showPassword ? 'text' : 'password'" v-model="password.value.value"
                        :error="password.errors.value[0]" :touched="password.isTouched.value"
                        placeholder="Enter your password" @blur="password.setTouched()" />
                    <Button type="button" variant="ghost" size="icon" @click="showPassword = !showPassword"
                        class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 z-10">
                        <Icon :name="showPassword ? 'eye-off' : 'eye'" class="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div>
                <Label for="confirm-password" class="text-sm font-medium text-gray-700">Confirm Password</Label>
                <div class="relative">
                    <Input id="confirm-password" :type="showConfirmPassword ? 'text' : 'password'"
                        v-model="confirmPassword.value.value" :error="confirmPassword.errors.value[0]"
                        :touched="confirmPassword.isTouched.value" placeholder="Confirm your password"
                        @blur="confirmPassword.setTouched()" />
                    <Button type="button" variant="ghost" size="icon"
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 z-10">
                        <Icon :name="showConfirmPassword ? 'eye-off' : 'eye'" class="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>

        <div class="flex gap-4">
            <Button type="button" variant="outline" @click="$emit('prev')" class="flex-1">
                Back
            </Button>
            <Button type="submit" @click="handleSubmit" :disabled="!isFormValid"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Continue
            </Button>
        </div>
    </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import { useFieldValidation } from '~/composables/useFieldValidation'
import { rules } from '~/utils/validators'
import { useClusterSignup } from '~/composables/useClusterSignup'

const emit = defineEmits(['next', 'prev'])

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const adminName = useFieldValidation('', [
    rules.required('Full name is required'),
    rules.minLength(2, 'Name must be at least 2 characters'),
    rules.genericName('Please enter a valid name')
])

const phoneNumber = useFieldValidation('', [
    rules.required('Phone number is required'),
    rules.custom(
        (value) => /^[\d\s\-\+\(\)]+$/.test(value),
        'Please enter a valid phone number'
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
        (value) => value === password.value.value,
        'Passwords must match'
    )
])

const isFormValid = computed(() =>
    adminName.isValid.value &&
    phoneNumber.isValid.value &&
    email.isValid.value &&
    password.isValid.value &&
    confirmPassword.isValid.value
)

const { signupState, saveEstateInfo } = useClusterSignup()

const handleSubmit = () => {
    const fields = [adminName, phoneNumber, email, password, confirmPassword]
    fields.forEach(field => field.setTouched())

    if (!isFormValid.value) return

    const existingData = signupState.value.estateInfo
    if (!existingData) {
        console.error('Estate info not found')
        return
    }

    const updatedData = {
        ...existingData,
        admin: {
            email_address: email.value.value,
            password: password.value.value,
            name: adminName.value.value,
            phone_number: phoneNumber.value.value,
        }
    }

    saveEstateInfo(updatedData)
    emit('next')
}
</script>
