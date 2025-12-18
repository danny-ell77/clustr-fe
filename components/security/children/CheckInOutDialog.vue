<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>{{ isCheckIn ? 'Check In Child' : 'Check Out Child' }}</DialogTitle>
                <DialogDescription>
                    {{ isCheckIn ? 'Record child entry' : 'Record child exit' }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div v-if="child" class="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Avatar class="w-12 h-12">
                        <AvatarImage v-if="child.profilePhoto" :src="child.profilePhoto" :alt="child.name" />
                        <AvatarFallback>{{ initials }}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p class="font-semibold">{{ child.name }}</p>
                        <p class="text-sm text-muted-foreground">{{ child.age }} years old • House {{
                            child.houseNumber }}</p>
                    </div>
                </div>

                <div v-if="!isCheckIn" class="space-y-4">
                    <div>
                        <Label for="reason">Reason *</Label>
                        <Input id="reason" v-model="formData.reason" placeholder="e.g., Going to school" required />
                    </div>

                    <div>
                        <Label for="destination">Destination *</Label>
                        <Input id="destination" v-model="formData.destination" placeholder="e.g., School" required />
                    </div>

                    <div>
                        <Label for="accompanyingAdult">Accompanying Adult *</Label>
                        <Input id="accompanyingAdult" v-model="formData.accompanyingAdult"
                            placeholder="Guardian name" required />
                    </div>

                    <div>
                        <Label for="expectedReturnTime">Expected Return Time *</Label>
                        <Input id="expectedReturnTime" v-model="formData.expectedReturnTime" type="datetime-local"
                            required />
                    </div>
                </div>

                <div>
                    <Label for="notes">Notes</Label>
                    <Textarea id="notes" v-model="formData.notes" placeholder="Additional notes (optional)" rows="3" />
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" @click="$emit('update:open', false)"
                        :disabled="isSubmitting">
                        Cancel
                    </Button>
                    <Button type="submit" :disabled="isSubmitting">
                        <Icon v-if="isSubmitting" name="loader-2" class="w-4 h-4 mr-2 animate-spin" />
                        {{ isCheckIn ? 'Check In' : 'Check Out' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import Icon from '~/components/Icon.vue'
import type { Child, CreateEntryExitLogDto } from '~/types/children'
import { EntryExitLogType } from '~/types/children'

interface Props {
    open: boolean
    child?: Child
    type: 'check-in' | 'check-out'
    isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isSubmitting: false
})

const emit = defineEmits<{
    'update:open': [value: boolean]
    submit: [data: CreateEntryExitLogDto]
}>()

const isCheckIn = computed(() => props.type === 'check-in')

const initials = computed(() => {
    if (!props.child) return ''
    return props.child.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
})

const formData = ref<Partial<CreateEntryExitLogDto>>({
    reason: '',
    destination: '',
    accompanyingAdult: '',
    expectedReturnTime: '',
    notes: ''
})

watch(() => props.open, (isOpen) => {
    if (isOpen) {
        formData.value = {
            reason: '',
            destination: '',
            accompanyingAdult: '',
            expectedReturnTime: '',
            notes: ''
        }
    }
})

const handleSubmit = () => {
    if (!props.child) return

    const now = new Date().toISOString()
    const data: CreateEntryExitLogDto = {
        child: props.child.id,
        logType: isCheckIn.value ? EntryExitLogType.ENTRY : EntryExitLogType.EXIT,
        date: now.split('T')[0],
        reason: formData.value.reason || '',
        destination: formData.value.destination || '',
        accompanyingAdult: formData.value.accompanyingAdult || '',
        expectedReturnTime: formData.value.expectedReturnTime,
        notes: formData.value.notes
    }

    emit('submit', data)
}
</script>
