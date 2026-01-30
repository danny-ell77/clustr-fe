<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{{ schedule ? 'Edit Schedule' : 'Create Maintenance Schedule' }}</DialogTitle>
                <DialogDescription>
                    {{ schedule ? 'Update recurring maintenance schedule' : 'Set up a recurring maintenance schedule' }}
                </DialogDescription>
            </DialogHeader>

            <DialogBody>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <Label for="name">Schedule Name *</Label>
                    <Input id="name" v-model="formData.name" placeholder="e.g., Monthly Generator Maintenance"
                        required />
                </div>

                <div>
                    <Label for="description">Description *</Label>
                    <Textarea id="description" v-model="formData.description"
                        placeholder="Describe the maintenance work to be performed" rows="3" required />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="propertyType">Property Type *</Label>
                        <Select v-model="formData.propertyType" required>
                            <SelectTrigger id="propertyType">
                                <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BUILDING">Building</SelectItem>
                                <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                                <SelectItem value="PLUMBING">Plumbing</SelectItem>
                                <SelectItem value="HVAC">HVAC</SelectItem>
                                <SelectItem value="LANDSCAPING">Landscaping</SelectItem>
                                <SelectItem value="SECURITY">Security</SelectItem>
                                <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                                <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="propertyLocation">Property Location *</Label>
                        <Input id="propertyLocation" v-model="formData.propertyLocation"
                            placeholder="e.g., Block A, Main Gate" required />
                    </div>
                </div>

                <div>
                    <Label for="equipmentName">Equipment Name</Label>
                    <Input id="equipmentName" v-model="formData.equipmentName"
                        placeholder="e.g., Generator Unit 1, Water Pump" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="frequencyType">Frequency *</Label>
                        <Select v-model="formData.frequencyType" required>
                            <SelectTrigger id="frequencyType">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DAILY">Daily</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                                <SelectItem value="SEMI_ANNUAL">Semi-Annual</SelectItem>
                                <SelectItem value="ANNUAL">Annual</SelectItem>
                                <SelectItem value="CUSTOM">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="frequencyValue">Frequency Value *</Label>
                        <Input id="frequencyValue" v-model.number="formData.frequencyValue" type="number" min="1"
                            placeholder="e.g., 1, 2, 3" required />
                        <p class="text-xs text-muted-foreground mt-1">
                            Number of {{ formData.frequencyType?.toLowerCase() || 'periods' }} between maintenance
                        </p>
                    </div>
                </div>

                <div>
                    <Label for="nextDueDate">Next Due Date *</Label>
                    <Input id="nextDueDate" v-model="formData.nextDueDate" type="date" required />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="estimatedDuration">Estimated Duration</Label>
                        <div class="flex items-center gap-1.5">
                            <Input id="estimatedDurationHours" v-model.number="estimatedDurationHours"
                                type="number" min="0" placeholder="0" class="w-16 text-center" />
                            <span class="text-xs text-muted-foreground">h</span>
                            <Input id="estimatedDurationMinutes" v-model.number="estimatedDurationMinutes"
                                type="number" min="0" max="59" placeholder="0" class="w-16 text-center" />
                            <span class="text-xs text-muted-foreground">m</span>
                        </div>
                    </div>

                    <div>
                        <Label for="estimatedCost">Estimated Cost</Label>
                        <Input id="estimatedCost" v-model="formData.estimatedCost" type="number" step="0.01" min="0"
                            placeholder="0.00" />
                    </div>
                </div>

                <div>
                    <Label for="instructions">Instructions</Label>
                    <Textarea id="instructions" v-model="formData.instructions"
                        placeholder="Step-by-step instructions for performing the maintenance" rows="3" />
                </div>

                <div>
                    <Label for="materialsNeeded">Materials Needed</Label>
                    <Textarea id="materialsNeeded" v-model="formData.materialsNeeded"
                        placeholder="List of materials required" rows="2" />
                </div>

                <div>
                    <Label for="toolsNeeded">Tools Needed</Label>
                    <Textarea id="toolsNeeded" v-model="formData.toolsNeeded" placeholder="List of tools required"
                        rows="2" />
                </div>

                </form>
            </DialogBody>

            <DialogFooter>
                <Button type="button" variant="outline" @click="isOpen = false" :disabled="isSubmitting">
                    Cancel
                </Button>
                <LoadingButton type="button" :loading="isSubmitting" @click="handleSubmit">
                    {{ schedule ? 'Update' : 'Create' }}
                </LoadingButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '~/components/ui/dialog'
import { Button, LoadingButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useMaintenance } from '~/composables/property/useMaintenance'
import type { MaintenanceSchedule } from '~/types/maintenance'
import type { CreateMaintenanceScheduleDto, UpdateMaintenanceScheduleDto } from '~/services/api/maintenance.api'
import { PropertyType } from '~/types/maintenance'

interface Props {
    open: boolean
    schedule?: MaintenanceSchedule
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'update:open': [value: boolean]
    'success': []
}>()

const { createScheduleMutation, updateScheduleMutation } = useMaintenance()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const formData = reactive<CreateMaintenanceScheduleDto>({
    name: '',
    description: '',
    propertyType: 'BUILDING' as PropertyType,
    propertyLocation: '',
    equipmentName: '',
    frequencyType: 'MONTHLY',
    frequencyValue: 1,
    nextDueDate: '',
    estimatedDuration: '',
    estimatedCost: '',
    instructions: '',
    materialsNeeded: '',
    toolsNeeded: ''
})

const isSubmitting = computed(() =>
    createScheduleMutation.isPending.value || updateScheduleMutation.isPending.value
)

const estimatedDurationHours = ref<number | undefined>(undefined)
const estimatedDurationMinutes = ref<number | undefined>(undefined)

function parseDuration(duration: string | undefined): { hours: number; minutes: number } {
    if (!duration) return { hours: 0, minutes: 0 }
    const parts = duration.split(':')
    if (parts.length >= 2) {
        return { hours: parseInt(parts[0]) || 0, minutes: parseInt(parts[1]) || 0 }
    }
    return { hours: 0, minutes: 0 }
}

function formatDuration(hours: number | undefined, minutes: number | undefined): string | undefined {
    if ((hours === undefined || hours === 0) && (minutes === undefined || minutes === 0)) {
        return undefined
    }
    const h = (hours || 0).toString().padStart(2, '0')
    const m = (minutes || 0).toString().padStart(2, '0')
    return `${h}:${m}:00`
}

watch(() => props.schedule, (schedule) => {
    if (schedule) {
        formData.name = schedule.name
        formData.description = schedule.description
        formData.propertyType = schedule.propertyType
        formData.propertyLocation = schedule.propertyLocation
        formData.equipmentName = schedule.equipmentName || ''
        formData.frequencyType = schedule.frequencyType
        formData.frequencyValue = schedule.frequencyValue
        formData.nextDueDate = schedule.nextDueDate.split('T')[0]
        const estDur = parseDuration(schedule.estimatedDuration)
        estimatedDurationHours.value = estDur.hours || undefined
        estimatedDurationMinutes.value = estDur.minutes || undefined
        formData.estimatedCost = schedule.estimatedCost || ''
        formData.instructions = schedule.instructions || ''
        formData.materialsNeeded = schedule.materialsNeeded || ''
        formData.toolsNeeded = schedule.toolsNeeded || ''
    } else {
        formData.name = ''
        formData.description = ''
        formData.propertyType = 'BUILDING' as PropertyType
        formData.propertyLocation = ''
        formData.equipmentName = ''
        formData.frequencyType = 'MONTHLY'
        formData.frequencyValue = 1
        formData.nextDueDate = ''
        estimatedDurationHours.value = undefined
        estimatedDurationMinutes.value = undefined
        formData.estimatedCost = ''
        formData.instructions = ''
        formData.materialsNeeded = ''
        formData.toolsNeeded = ''
    }
}, { immediate: true })

const handleSubmit = async () => {
    try {
        if (props.schedule) {
            const updateData: UpdateMaintenanceScheduleDto = {
                name: formData.name,
                description: formData.description,
                propertyType: formData.propertyType,
                propertyLocation: formData.propertyLocation,
                equipmentName: formData.equipmentName || undefined,
                frequencyType: formData.frequencyType,
                frequencyValue: formData.frequencyValue,
                nextDueDate: formData.nextDueDate,
                estimatedDuration: formatDuration(estimatedDurationHours.value, estimatedDurationMinutes.value),
                estimatedCost: formData.estimatedCost || undefined,
                instructions: formData.instructions || undefined,
                materialsNeeded: formData.materialsNeeded || undefined,
                toolsNeeded: formData.toolsNeeded || undefined
            }
            await updateScheduleMutation.mutateAsync({
                id: props.schedule.id,
                data: updateData
            })
        } else {
            const createData: CreateMaintenanceScheduleDto = {
                name: formData.name,
                description: formData.description,
                propertyType: formData.propertyType,
                propertyLocation: formData.propertyLocation,
                equipmentName: formData.equipmentName || undefined,
                frequencyType: formData.frequencyType,
                frequencyValue: formData.frequencyValue,
                nextDueDate: formData.nextDueDate,
                estimatedDuration: formatDuration(estimatedDurationHours.value, estimatedDurationMinutes.value),
                estimatedCost: formData.estimatedCost || undefined,
                instructions: formData.instructions || undefined,
                materialsNeeded: formData.materialsNeeded || undefined,
                toolsNeeded: formData.toolsNeeded || undefined
            }
            await createScheduleMutation.mutateAsync(createData)
        }
        emit('success')
        isOpen.value = false
    } catch (error) {
        console.error('Failed to save maintenance schedule:', error)
    }
}
</script>
