<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>{{ mode === 'check-in' ? 'Check In Visitor' : 'Check Out Visitor' }}</DialogTitle>
                <DialogDescription>
                    {{ mode === 'check-in' ? 'Record visitor arrival' : 'Record visitor departure' }}
                </DialogDescription>
            </DialogHeader>

            <div v-if="visitor" class="space-y-4">
                <div class="p-4 bg-muted rounded-lg space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Visitor Name</span>
                        <span class="text-sm">{{ visitor.name }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Phone</span>
                        <span class="text-sm">{{ visitor.phone }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Access Code</span>
                        <span class="text-sm font-mono">{{ visitor.accessCode }}</span>
                    </div>
                    <div v-if="visitor.purpose" class="flex items-center justify-between">
                        <span class="text-sm font-medium">Purpose</span>
                        <span class="text-sm">{{ visitor.purpose }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Expected Arrival</span>
                        <span class="text-sm">{{ formatDateTime(visitor.estimatedArrival) }}</span>
                    </div>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <Label for="notes">Notes</Label>
                        <Textarea id="notes" v-model="notes"
                            :placeholder="mode === 'check-in' ? 'Any observations during check-in' : 'Any observations during check-out'"
                            rows="3" />
                    </div>

                    <div v-if="mode === 'check-in'" class="p-3 bg-primary/10 border  border-primary/30 rounded-lg">
                        <div class="flex items-start gap-2">
                            <Icon name="info" class="w-4 h-4 text-primary mt-0.5" />
                            <div class="text-sm text-primary">
                                <p class="font-medium">Check-in will:</p>
                                <ul class="list-disc list-inside mt-1 space-y-1">
                                    <li>Record arrival time</li>
                                    <li>Update visitor status to "Checked In"</li>
                                    <li>Create entry log</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div v-else class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div class="flex items-start gap-2">
                            <Icon name="info" class="w-4 h-4 text-orange-600 mt-0.5" />
                            <div class="text-sm text-orange-800">
                                <p class="font-medium">Check-out will:</p>
                                <ul class="list-disc list-inside mt-1 space-y-1">
                                    <li>Record departure time</li>
                                    <li>Update visitor status to "Checked Out"</li>
                                    <li>Create exit log</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" @click="isOpen = false" :disabled="isSubmitting">
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="isSubmitting"
                            :variant="mode === 'check-in' ? 'default' : 'destructive'">
                            {{ isSubmitting ? 'Processing...' : mode === 'check-in' ? 'Check In' : 'Check Out' }}
                        </Button>
                    </div>
                </form>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import Icon from '~/components/Icon.vue'
import { useVisitors } from '~/composables/security/useVisitors'
import type { Visitor } from '~/types/visitors'

interface Props {
    open: boolean
    visitor?: Visitor
    mode: 'check-in' | 'check-out'
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'update:open': [value: boolean]
    'success': []
}>()

const { checkInMutation, checkOutMutation } = useVisitors()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const notes = ref('')

const isSubmitting = computed(() =>
    checkInMutation.isPending.value || checkOutMutation.isPending.value
)

watch(() => props.open, (open) => {
    if (!open) {
        notes.value = ''
    }
})

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}

const handleSubmit = async () => {
    if (!props.visitor) return

    try {
        if (props.mode === 'check-in') {
            await checkInMutation.mutateAsync({
                id: props.visitor.id,
                notes: notes.value || undefined
            })
        } else {
            await checkOutMutation.mutateAsync({
                id: props.visitor.id,
                notes: notes.value || undefined
            })
        }
        emit('success')
        isOpen.value = false
    } catch (error) {
        console.error(`Failed to ${props.mode} visitor:`, error)
    }
}
</script>
