<template>
    <div class="space-y-3">
        <div>
            <Label>Approval Status</Label>
            <ResidentApprovalStatusSelect :model-value="getApprovalValue(modelValue.approvedByAdmin)"
                @update:model-value="updateFilter('approvedByAdmin', $event === 'all' ? undefined : $event === 'true')" />
        </div>

        <div>
            <Label>Verification Status</Label>
            <ResidentVerificationStatusSelect :model-value="getVerificationValue(modelValue.isVerified)"
                @update:model-value="updateFilter('isVerified', $event === 'all' ? undefined : $event === 'true')" />
        </div>

        <div>
            <Label>Search</Label>
            <Input type="text" placeholder="Search by name, email, or phone..." :model-value="modelValue.search || ''"
                @input="updateFilter('search', ($event.target as HTMLInputElement).value)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import ResidentApprovalStatusSelect from './ResidentApprovalStatusSelect.vue'
import ResidentVerificationStatusSelect from './ResidentVerificationStatusSelect.vue'
import type { ResidentFilters } from '~/types/residents'

/**
 * Resident filter form component for managing resident list filters.
 */

const props = defineProps<{
    modelValue: Partial<ResidentFilters>
}>()

const emit = defineEmits<{
    'update:modelValue': [value: Partial<ResidentFilters>]
}>()

const getApprovalValue = (value: boolean | undefined) => {
    if (value === undefined) return 'all'
    return value ? 'true' : 'false'
}

const getVerificationValue = (value: boolean | undefined) => {
    if (value === undefined) return 'all'
    return value ? 'true' : 'false'
}

const updateFilter = (key: keyof ResidentFilters, value: any) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value
    })
}
</script>
