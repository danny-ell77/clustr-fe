<template>
    <Card class="mb-6">
        <CardHeader>
            <CardTitle>Filter Payments</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="flex gap-4 items-end">
                <div class="flex-1">
                    <Label>Status</Label>
                    <Select :model-value="modelValue.status || 'All'"
                        @update:model-value="(value) => updateFilter('status', value === 'All' ? undefined : value)">
                        <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="PAUSED">Paused</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="flex-1">
                    <Label>Frequency</Label>
                    <Select :model-value="modelValue.frequency || 'All'"
                        @update:model-value="(value) => updateFilter('frequency', value === 'All' ? undefined : value)">
                        <SelectTrigger>
                            <SelectValue placeholder="All Frequencies" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Frequencies</SelectItem>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button variant="outline" @click="$emit('clear')">Clear Filters</Button>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

interface RecurringPaymentFilters {
    status?: string
    frequency?: string
}

interface Props {
    modelValue: RecurringPaymentFilters
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: RecurringPaymentFilters]
    clear: []
}>()

const updateFilter = (key: keyof RecurringPaymentFilters, value: string | undefined) => {
    const newFilters = { ...props.modelValue }
    if (value === '' || value === undefined) {
        delete newFilters[key]
    } else {
        newFilters[key] = value
    }
    emit('update:modelValue', newFilters)
}
</script>
