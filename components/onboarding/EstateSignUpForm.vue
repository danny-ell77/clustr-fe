<template>
    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="space-y-4">
            <div>
                <h3 class="text-xl font-semibold text-gray-900">Tell us about your Facility</h3>
                <p class="text-sm text-gray-600 mt-1">Let's start by setting up your property details</p>
            </div>

            <div>
                <Label for="estate-type" class="text-sm font-medium text-gray-700">What kind of Facility do you
                    manage?</Label>
                <Select v-model="estateType" @update:modelValue="handleEstateTypeChange">
                    <SelectTrigger id="estate-type" :class="{ 'border-red-500': estateTypeError && estateTypeTouched }"
                        @blur="estateTypeTouched = true">
                        <SelectValue placeholder="Select facility type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ESTATE">Estate</SelectItem>
                        <SelectItem value="FACILITY">Facility</SelectItem>
                        <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                        <SelectItem value="MIXED_USE">Mixed Use</SelectItem>
                    </SelectContent>
                </Select>
                <p v-if="estateTypeError && estateTypeTouched" class="text-sm text-red-600 mt-1">
                    {{ estateTypeError }}
                </p>
            </div>

            <div>
                <Label for="estate-name" class="text-sm font-medium text-gray-700">Facility Name</Label>
                <Input id="estate-name" type="text" v-model="estateName" :error="estateNameError"
                    :touched="estateNameTouched" placeholder="Enter your facility name" @blur="estateNameTouched = true"
                    @input="validateEstateName" />
            </div>
        </div>

        <div>
            <Button @click="handleSubmit" :disabled="!isFormValid"
                class="w-full bg-primary hover:bg-primary/90 text-white">
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { useClusterSignup } from '~/composables/useClusterSignup'

const emit = defineEmits(['next'])

const estateName = ref('')
const estateNameTouched = ref(false)
const estateNameError = ref('')

const estateType = ref('')
const estateTypeTouched = ref(false)
const estateTypeError = ref('')

const isEstateNameValid = computed(() => {
    const value = estateName.value.trim()
    if (!value) return false
    if (value.length < 3) return false
    if (value.length > 255) return false
    const genericNamePattern = /^[a-zA-Z0-9\s\-_'.]+$/
    return genericNamePattern.test(value)
})

const isEstateTypeValid = computed(() => {
    const validTypes = ['ESTATE', 'FACILITY', 'COMMERCIAL', 'MIXED_USE']
    return validTypes.includes(estateType.value)
})

const validateEstateName = () => {
    const value = estateName.value.trim()

    if (!value) {
        estateNameError.value = 'Estate name is required'
        return false
    }

    if (value.length < 3) {
        estateNameError.value = 'Estate name must be at least 3 characters'
        return false
    }

    if (value.length > 255) {
        estateNameError.value = 'Estate name cannot exceed 255 characters'
        return false
    }

    const genericNamePattern = /^[a-zA-Z0-9\s\-_'.]+$/
    if (!genericNamePattern.test(value)) {
        estateNameError.value = 'Please enter a valid estate name'
        return false
    }

    estateNameError.value = ''
    return true
}

const validateEstateType = () => {
    const validTypes = ['ESTATE', 'FACILITY', 'COMMERCIAL', 'MIXED_USE']

    if (!estateType.value) {
        estateTypeError.value = 'Estate type is required'
        return false
    }

    if (!validTypes.includes(estateType.value)) {
        estateTypeError.value = 'Invalid estate type'
        return false
    }

    estateTypeError.value = ''
    return true
}

const handleEstateTypeChange = (value) => {
    estateType.value = value
    validateEstateType()
}

const isFormValid = computed(() => {
    return isEstateNameValid.value && isEstateTypeValid.value
})

const { saveEstateInfo, slugifyDomain } = useClusterSignup()

const handleSubmit = () => {
    estateNameTouched.value = true
    estateTypeTouched.value = true

    const nameValid = validateEstateName()
    const typeValid = validateEstateType()

    if (!nameValid || !typeValid) return

    const clusterData = {
        name: estateName.value,
        type: estateType.value,
        admin: {
            email_address: '',
            password: '',
            name: '',
            phone_number: '',
        }
    }

    saveEstateInfo(clusterData)
    emit('next', { defaultSubdomain: slugifyDomain(estateName.value) })
}
</script>
