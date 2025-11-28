<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{{ log ? 'Edit Maintenance Log' : 'Create Maintenance Log' }}</DialogTitle>
                <DialogDescription>
                    {{ log ? 'Update maintenance log details' : 'Create a new maintenance log entry' }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <Label for="title">Title *</Label>
                    <Input id="title" v-model="formData.title" placeholder="Brief description of maintenance task"
                        required />
                </div>

                <div>
                    <Label for="description">Description *</Label>
                    <Textarea id="description" v-model="formData.description"
                        placeholder="Detailed description of the maintenance work" rows="4" required />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="maintenanceType">Maintenance Type *</Label>
                        <Select v-model="formData.maintenanceType" required>
                            <SelectTrigger id="maintenanceType">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                                <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                                <SelectItem value="EMERGENCY">Emergency</SelectItem>
                                <SelectItem value="ROUTINE">Routine</SelectItem>
                                <SelectItem value="INSPECTION">Inspection</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="propertyLocation">Property Location *</Label>
                        <Input id="propertyLocation" v-model="formData.propertyLocation"
                            placeholder="e.g., Block A, Unit 101" required />
                    </div>

                    <div>
                        <Label for="equipmentName">Equipment Name</Label>
                        <Input id="equipmentName" v-model="formData.equipmentName"
                            placeholder="e.g., Generator, Water Pump" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="priority">Priority *</Label>
                        <Select v-model="formData.priority" required>
                            <SelectTrigger id="priority">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="URGENT">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="scheduledDate">Scheduled Date</Label>
                        <Input id="scheduledDate" v-model="formData.scheduledDate" type="date" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="estimatedDuration">Estimated Duration</Label>
                        <Input id="estimatedDuration" v-model="formData.estimatedDuration"
                            placeholder="e.g., 2 hours, 3 days" />
                    </div>

                    <div>
                        <Label for="cost">Estimated Cost</Label>
                        <Input id="cost" v-model="formData.cost" type="number" step="0.01" min="0" placeholder="0.00" />
                    </div>
                </div>

                <div>
                    <Label for="materialsUsed">Materials Used</Label>
                    <Textarea id="materialsUsed" v-model="formData.materialsUsed"
                        placeholder="List materials needed or used" rows="2" />
                </div>

                <div>
                    <Label for="toolsUsed">Tools Used</Label>
                    <Textarea id="toolsUsed" v-model="formData.toolsUsed" placeholder="List tools needed or used"
                        rows="2" />
                </div>

                <div>
                    <Label for="notes">Notes</Label>
                    <Textarea id="notes" v-model="formData.notes" placeholder="Additional notes or instructions"
                        rows="2" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="nextMaintenanceDue">Next Maintenance Due</Label>
                        <Input id="nextMaintenanceDue" v-model="formData.nextMaintenanceDue" type="date" />
                    </div>

                    <div>
                        <Label for="warrantyExpiry">Warranty Expiry</Label>
                        <Input id="warrantyExpiry" v-model="formData.warrantyExpiry" type="date" />
                    </div>
                </div>

                <div v-if="log" class="space-y-4 pt-4 border-t">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="status">Status</Label>
                            <Select v-model="formData.status">
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label for="actualDuration">Actual Duration</Label>
                            <Input id="actualDuration" v-model="formData.actualDuration"
                                placeholder="e.g., 2.5 hours" />
                        </div>
                    </div>

                    <div v-if="formData.status === 'COMPLETED'">
                        <Label for="completionNotes">Completion Notes</Label>
                        <Textarea id="completionNotes" v-model="formData.completionNotes"
                            placeholder="Describe the work completed and any findings" rows="3" />
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" @click="isOpen = false" :disabled="isSubmitting">
                        Cancel
                    </Button>
                    <Button type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : log ? 'Update' : 'Create' }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useMaintenance } from '~/composables/property/useMaintenance'
import type {
    MaintenanceLog,
    CreateMaintenanceLogDto,
    UpdateMaintenanceLogDto,
    MaintenanceType,
    PropertyType,
    MaintenancePriority,
    MaintenanceStatus
} from '~/types/maintenance'

interface Props {
    open: boolean
    log?: MaintenanceLog
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'update:open': [value: boolean]
    'success': []
}>()

const { createLogMutation, updateLogMutation } = useMaintenance()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const formData = reactive<CreateMaintenanceLogDto & Partial<UpdateMaintenanceLogDto>>({
    title: '',
    description: '',
    maintenanceType: 'ROUTINE' as MaintenanceType,
    propertyType: 'BUILDING' as PropertyType,
    propertyLocation: '',
    equipmentName: '',
    priority: 'MEDIUM' as MaintenancePriority,
    scheduledDate: '',
    estimatedDuration: '',
    cost: '',
    materialsUsed: '',
    toolsUsed: '',
    notes: '',
    nextMaintenanceDue: '',
    warrantyExpiry: '',
    status: undefined,
    actualDuration: '',
    completionNotes: ''
})

const isSubmitting = computed(() =>
    createLogMutation.isPending.value || updateLogMutation.isPending.value
)

watch(() => props.log, (log) => {
    if (log) {
        formData.title = log.title
        formData.description = log.description
        formData.maintenanceType = log.maintenanceType
        formData.propertyType = log.propertyType
        formData.propertyLocation = log.propertyLocation
        formData.equipmentName = log.equipmentName || ''
        formData.priority = log.priority
        formData.scheduledDate = log.scheduledDate || ''
        formData.estimatedDuration = log.estimatedDuration || ''
        formData.cost = log.cost || ''
        formData.materialsUsed = log.materialsUsed || ''
        formData.toolsUsed = log.toolsUsed || ''
        formData.notes = log.notes || ''
        formData.nextMaintenanceDue = log.nextMaintenanceDue || ''
        formData.warrantyExpiry = log.warrantyExpiry || ''
        formData.status = log.status
        formData.actualDuration = log.actualDuration || ''
        formData.completionNotes = log.completionNotes || ''
    } else {
        formData.title = ''
        formData.description = ''
        formData.maintenanceType = 'ROUTINE' as MaintenanceType
        formData.propertyType = 'BUILDING' as PropertyType
        formData.propertyLocation = ''
        formData.equipmentName = ''
        formData.priority = 'MEDIUM' as MaintenancePriority
        formData.scheduledDate = ''
        formData.estimatedDuration = ''
        formData.cost = ''
        formData.materialsUsed = ''
        formData.toolsUsed = ''
        formData.notes = ''
        formData.nextMaintenanceDue = ''
        formData.warrantyExpiry = ''
        formData.status = undefined
        formData.actualDuration = ''
        formData.completionNotes = ''
    }
}, { immediate: true })

const handleSubmit = async () => {
    try {
        if (props.log) {
            const updateData: UpdateMaintenanceLogDto = {
                title: formData.title,
                description: formData.description,
                maintenanceType: formData.maintenanceType,
                propertyType: formData.propertyType,
                propertyLocation: formData.propertyLocation,
                equipmentName: formData.equipmentName || undefined,
                priority: formData.priority,
                scheduledDate: formData.scheduledDate || undefined,
                estimatedDuration: formData.estimatedDuration || undefined,
                cost: formData.cost || undefined,
                materialsUsed: formData.materialsUsed || undefined,
                toolsUsed: formData.toolsUsed || undefined,
                notes: formData.notes || undefined,
                nextMaintenanceDue: formData.nextMaintenanceDue || undefined,
                warrantyExpiry: formData.warrantyExpiry || undefined,
                status: formData.status as MaintenanceStatus | undefined,
                actualDuration: formData.actualDuration || undefined,
                completionNotes: formData.completionNotes || undefined
            }
            await updateLogMutation.mutateAsync({
                id: props.log.id,
                data: updateData
            })
        } else {
            const createData: CreateMaintenanceLogDto = {
                title: formData.title,
                description: formData.description,
                maintenanceType: formData.maintenanceType,
                propertyType: formData.propertyType,
                propertyLocation: formData.propertyLocation,
                equipmentName: formData.equipmentName || undefined,
                priority: formData.priority,
                scheduledDate: formData.scheduledDate || undefined,
                estimatedDuration: formData.estimatedDuration || undefined,
                cost: formData.cost || undefined,
                materialsUsed: formData.materialsUsed || undefined,
                toolsUsed: formData.toolsUsed || undefined,
                notes: formData.notes || undefined,
                nextMaintenanceDue: formData.nextMaintenanceDue || undefined,
                warrantyExpiry: formData.warrantyExpiry || undefined
            }
            await createLogMutation.mutateAsync(createData)
        }
        emit('success')
        isOpen.value = false
    } catch (error) {
        console.error('Failed to save maintenance log:', error)
    }
}
</script>
