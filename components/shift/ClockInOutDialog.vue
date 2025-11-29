<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-md">
            <div class="space-y-4">
                <div>
                    <h2 class="text-2xl">{{ action === 'in' ? 'Clock In' : 'Clock Out' }}</h2>
                    <p class="text-sm text-muted-foreground">
                        {{ action === 'in' ? 'Start your shift' : 'End your shift' }}
                    </p>
                </div>

                <div v-if="shift" class="p-4 bg-muted rounded-lg space-y-2">
                    <div class="flex justify-between">
                        <span class="text-sm text-muted-foreground">Shift</span>
                        <span class="text-sm font-medium">{{ shift.title }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm text-muted-foreground">Type</span>
                        <span class="text-sm font-medium">{{ shift.shiftTypeDisplay }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm text-muted-foreground">Scheduled Time</span>
                        <span class="text-sm font-medium">
                            {{ formatTime(shift.startTime) }} - {{ formatTime(shift.endTime) }}
                        </span>
                    </div>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <Label for="timestamp">Time *</Label>
                        <Input id="timestamp" v-model="formData.timestamp" type="datetime-local" required />
                    </div>

                    <div>
                        <Label for="notes">Notes</Label>
                        <Textarea id="notes" v-model="formData.notes" placeholder="Any notes?" rows="3" />
                    </div>

                    <div class="flex gap-2 pt-4">
                        <Button type="button" variant="outline" class="flex-1" @click="$emit('update:open', false)">
                            Cancel
                        </Button>
                        <Button type="submit" class="flex-1" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Processing...' : action === 'in' ? 'Clock In' : 'Clock Out' }}
                        </Button>
                    </div>
                </form>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import type { Shift, ClockInOutDto } from '~/types/shifts'

interface Props {
    open: boolean
    shift?: Shift
    action: 'in' | 'out'
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:open': [value: boolean]
    'submit': [data: ClockInOutDto]
}>()

const isSubmitting = ref(false)

const formData = ref<ClockInOutDto>({
    timestamp: '',
    notes: ''
})

watch(() => props.open, (isOpen) => {
    if (isOpen) {
        const now = new Date()
        const offset = now.getTimezoneOffset() * 60000
        const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16)
        formData.value.timestamp = localISOTime
        formData.value.notes = ''
    }
}, { immediate: true })

function formatTime(timeStr: string): string {
    const date = new Date(timeStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        const submitData: ClockInOutDto = {
            timestamp: formData.value.timestamp,
            notes: formData.value.notes || undefined
        }
        emit('submit', submitData)
    } finally {
        isSubmitting.value = false
    }
}
</script>
