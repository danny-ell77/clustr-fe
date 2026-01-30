<template>
    <Card>
        <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <Label>Start Date</Label>
                    <Input 
                        :model-value="modelValue.startDate" 
                        @update:model-value="updateFilter('startDate', $event as string)"
                        type="date" 
                    />
                </div>

                <div>
                    <Label>End Date</Label>
                    <Input 
                        :model-value="modelValue.endDate" 
                        @update:model-value="updateFilter('endDate', $event as string)"
                        type="date" 
                    />
                </div>

                <div>
                    <Label>Shift Type</Label>
                    <Select 
                        :model-value="modelValue.shiftType"
                        @update:model-value="updateFilter('shiftType', $event)"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Types</SelectItem>
                            <SelectItem value="SECURITY">Security</SelectItem>
                            <SelectItem value="CLEANING">Cleaning</SelectItem>
                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                            <SelectItem value="RECEPTION">Reception</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Status</Label>
                    <Select 
                        :model-value="modelValue.status"
                        @update:model-value="updateFilter('status', $event)"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="NO_SHOW">No Show</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div class="flex gap-2 mt-4">
                <Button @click="$emit('apply')">
                    <Icon name="lucide:filter" class="w-4 h-4 mr-2" />
                    Apply Filters
                </Button>
                <Button variant="outline" @click="$emit('clear')">
                    Clear Filters
                </Button>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

interface Filters {
    startDate: string
    endDate: string
    shiftType: string
    status: string
}

const props = defineProps<{
    modelValue: Filters
}>()

const emit = defineEmits<{
    'update:modelValue': [value: Filters]
    apply: []
    clear: []
}>()

const updateFilter = (key: keyof Filters, value: string) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value
    })
}
</script>
