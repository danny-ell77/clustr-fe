<template>
    <Dialog v-model:open="isOpen">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Resolve Alert</DialogTitle>
                <DialogDescription>
                    Mark this alert as resolved
                </DialogDescription>
            </DialogHeader>

            <DialogBody>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <Label>Resolution Notes</Label>
                        <Textarea v-model="notes" placeholder="Enter resolution notes..." rows="4" />
                    </div>
                </form>
            </DialogBody>

            <DialogFooter>
                <Button type="button" variant="outline" @click="isOpen = false">
                    Cancel
                </Button>
                <LoadingButton :loading="resolveMutation.isPending.value" @click="handleSubmit">
                    Resolve
                </LoadingButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '~/components/ui/dialog'
import { Button, LoadingButton } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { emergencyApi } from '~/services/api/emergency.api'
import { queryKeys } from '~/constants/query-keys'

interface Props {
    open: boolean
    alertId: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'update:open': [value: boolean]
    success: []
}>()

const queryClient = useQueryClient()
const toast = useToast()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const notes = ref('')

watch(isOpen, (open) => {
    if (!open) notes.value = ''
})

const resolveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
        emergencyApi.resolveAlert(id, notes),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
        if (props.alertId) {
            queryClient.invalidateQueries({
                queryKey: queryKeys.emergency.alerts.detail(props.alertId)
            })
        }
        toast.success('Alert resolved successfully')
        emit('success')
        isOpen.value = false
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to resolve alert')
    }
})

const handleSubmit = () => {
    if (!props.alertId) return
    resolveMutation.mutate({
        id: props.alertId,
        notes: notes.value
    })
}
</script>
