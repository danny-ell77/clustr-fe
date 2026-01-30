<template>
    <div class="space-y-3">
        <div>
            <Label>Status</Label>
            <Select :model-value="modelValue.status || 'All'"
                @update:model-value="(value) => updateFilter('status', value === 'All' ? undefined : value)">
                <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="DISPUTED">Disputed</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div>
            <Label>Bill Type</Label>
            <Select :model-value="modelValue.type || 'All'"
                @update:model-value="(value) => updateFilter('type', value === 'All' ? undefined : value)">
                <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                    <SelectItem value="WATER">Water</SelectItem>
                    <SelectItem value="SECURITY">Security</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="SERVICE_CHARGE">Service Charge</SelectItem>
                    <SelectItem value="WASTE_MANAGEMENT">Waste Management</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div>
            <Label>Date From</Label>
            <Input type="date" :model-value="modelValue.date_from || ''"
                @change="(e: Event) => updateFilter('date_from', (e.target as HTMLInputElement).value)" />
        </div>

        <div>
            <Label>Search</Label>
            <Input type="text" placeholder="Search bills..." :model-value="modelValue.search || ''"
                @input="(e: Event) => updateFilter('search', (e.target as HTMLInputElement).value)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

interface BillFilters {
    status?: string
    type?: string
    date_from?: string
    search?: string
}

interface Props {
    modelValue: BillFilters
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: BillFilters]
}>()

const updateFilter = (key: keyof BillFilters, value: string | undefined) => {
    const newFilters = { ...props.modelValue }
    if (value === '' || value === undefined) {
        delete newFilters[key]
    } else {
        newFilters[key] = value
    }
    emit('update:modelValue', newFilters)
}
</script>
