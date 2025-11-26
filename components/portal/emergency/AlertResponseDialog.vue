<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{{ dialogTitle }}</DialogTitle>
                <DialogDescription>{{ dialogDescription }}</DialogDescription>
            </DialogHeader>

            <div v-if="alert" class="space-y-4 py-4">
                <div class="rounded-lg bg-muted p-4 space-y-2">
                    <div class="flex items-center gap-2">
                        <Badge :class="emergencyTypeBadgeClass">
                            {{ alert.emergencyTypeDisplay }}
                        </Badge>
                        <PriorityBadge :priority="alert.priority" />
                    </div>

                    <div class="space-y-1">
                        <p class="text-sm font-medium">{{ alert.alertId }}</p>
                        <p class="text-sm text-muted-foreground">
                            Reported by {{ alert.userName }} at {{ alert.location }}
                        </p>
                    </div>

                    <p class="text-sm">{{ alert.description }}</p>
                </div>

                <div v-if="action === 'resolve'" class="space-y-2">
                    <Label for="resolution-notes">Resolution Notes *</Label>
                    <Textarea id="resolution-notes" v-model="formData.resolutionNotes"
                        placeholder="Describe how the emergency was resolved..." rows="4" required />
                    <p class="text-xs text-muted-foreground">
                        Provide details about the resolution and any follow-up actions taken.
                    </p>
                </div>

                <div v-else-if="action === 'cancel'" class="space-y-2">
                    <Label for="cancellation-reason">Cancellation Reason *</Label>
                    <Textarea id="cancellation-reason" v-model="formData.cancellationReason"
                        placeholder="Explain why this alert is being cancelled..." rows="4" required />
                    <p class="text-xs text-muted-foreground">
                        Provide a clear reason for cancelling this emergency alert.
                    </p>
                </div>

                <div v-else-if="action === 'acknowledge'" class="space-y-2">
                    <Label for="acknowledge-notes">Notes (Optional)</Label>
                    <Textarea id="acknowledge-notes" v-model="formData.notes"
                        placeholder="Add any notes about acknowledging this alert..." rows="3" />
                </div>

                <div v-else-if="action === 'respond'" class="space-y-4">
                    <div class="space-y-2">
                        <Label for="response-type">Response Type *</Label>
                        <select id="response-type" v-model="formData.responseType"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required>
                            <option value="">Select response type</option>
                            <option value="ON_SITE">On-Site Response</option>
                            <option value="REMOTE">Remote Assistance</option>
                            <option value="DISPATCH">Dispatch Team</option>
                            <option value="COORDINATE">Coordinate with Authorities</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <Label for="response-notes">Response Notes *</Label>
                        <Textarea id="response-notes" v-model="formData.responseNotes"
                            placeholder="Describe your response plan and actions..." rows="4" required />
                    </div>

                    <div class="space-y-2">
                        <Label for="estimated-arrival">Estimated Arrival (Optional)</Label>
                        <Input id="estimated-arrival" v-model="formData.estimatedArrival" type="datetime-local" />
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t">
                <Button variant="outline" @click="handleCancel" :disabled="isSubmitting">
                    Cancel
                </Button>
                <Button :variant="confirmButtonVariant" @click="handleSubmit" :disabled="isSubmitting || !isFormValid">
                    {{ isSubmitting ? 'Processing...' : confirmButtonText }}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Input } from '~/components/ui/input'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import type { SOSAlert } from '~/types/emergency'

interface Props {
    open: boolean
    alert: SOSAlert | null
    action: 'acknowledge' | 'respond' | 'resolve' | 'cancel'
    isSubmitting?: boolean
}

interface FormData {
    notes?: string
    resolutionNotes?: string
    cancellationReason?: string
    responseType?: string
    responseNotes?: string
    estimatedArrival?: string
}

const props = withDefaults(defineProps<Props>(), {
    isSubmitting: false
})

const emit = defineEmits<{
    'update:open': [value: boolean]
    'submit': [data: FormData]
    'cancel': []
}>()

const formData = reactive<FormData>({
    notes: '',
    resolutionNotes: '',
    cancellationReason: '',
    responseType: '',
    responseNotes: '',
    estimatedArrival: ''
})

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const dialogTitle = computed(() => {
    const titles = {
        acknowledge: 'Acknowledge Emergency Alert',
        respond: 'Start Emergency Response',
        resolve: 'Resolve Emergency Alert',
        cancel: 'Cancel Emergency Alert'
    }
    return titles[props.action]
})

const dialogDescription = computed(() => {
    const descriptions = {
        acknowledge: 'Confirm that you have received and reviewed this emergency alert.',
        respond: 'Provide details about your response plan and estimated arrival time.',
        resolve: 'Mark this emergency as resolved and provide resolution details.',
        cancel: 'Cancel this emergency alert and provide a reason for cancellation.'
    }
    return descriptions[props.action]
})

const confirmButtonText = computed(() => {
    const texts = {
        acknowledge: 'Acknowledge Alert',
        respond: 'Start Response',
        resolve: 'Resolve Alert',
        cancel: 'Cancel Alert'
    }
    return texts[props.action]
})

const confirmButtonVariant = computed(() => {
    return props.action === 'cancel' ? 'destructive' : 'default'
})

const emergencyTypeBadgeClass = computed(() => {
    if (!props.alert) return ''

    const typeColors: Record<string, string> = {
        FIRE: 'bg-red-100 text-red-800',
        MEDICAL: 'bg-pink-100 text-pink-800',
        SECURITY: 'bg-purple-100 text-purple-800',
        ACCIDENT: 'bg-orange-100 text-orange-800',
        NATURAL_DISASTER: 'bg-yellow-100 text-yellow-800',
        UTILITY_FAILURE: 'bg-blue-100 text-blue-800',
        OTHER: 'bg-gray-100 text-gray-800'
    }

    return typeColors[props.alert.emergencyType] || 'bg-gray-100 text-gray-800'
})

const isFormValid = computed(() => {
    if (props.action === 'resolve') {
        return !!formData.resolutionNotes?.trim()
    }
    if (props.action === 'cancel') {
        return !!formData.cancellationReason?.trim()
    }
    if (props.action === 'respond') {
        return !!formData.responseType && !!formData.responseNotes?.trim()
    }
    return true
})

const handleSubmit = () => {
    if (!isFormValid.value) return

    const submitData: FormData = {}

    if (props.action === 'acknowledge') {
        submitData.notes = formData.notes
    } else if (props.action === 'resolve') {
        submitData.resolutionNotes = formData.resolutionNotes
    } else if (props.action === 'cancel') {
        submitData.cancellationReason = formData.cancellationReason
    } else if (props.action === 'respond') {
        submitData.responseType = formData.responseType
        submitData.responseNotes = formData.responseNotes
        submitData.estimatedArrival = formData.estimatedArrival
    }

    emit('submit', submitData)
}

const handleCancel = () => {
    emit('cancel')
    isOpen.value = false
}

watch(() => props.open, (newValue) => {
    if (!newValue) {
        formData.notes = ''
        formData.resolutionNotes = ''
        formData.cancellationReason = ''
        formData.responseType = ''
        formData.responseNotes = ''
        formData.estimatedArrival = ''
    }
})
</script>
