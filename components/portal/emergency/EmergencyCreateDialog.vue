<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Create Emergency Alert</DialogTitle>
                <DialogDescription>
                    Create a new emergency alert on behalf of a resident
                </DialogDescription>
            </DialogHeader>

            <DialogBody>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <Label>User ID</Label>
                        <Input v-model="formData.userId" required placeholder="Enter user ID" />
                    </div>

                    <div>
                        <Label>Emergency Type</Label>
                        <Select v-model="formData.emergencyType">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="health">Health Emergency</SelectItem>
                                <SelectItem value="theft">Theft/Robbery</SelectItem>
                                <SelectItem value="domestic_violence">Domestic Violence</SelectItem>
                                <SelectItem value="fire">Fire Emergency</SelectItem>
                                <SelectItem value="security">Security Issue</SelectItem>
                                <SelectItem value="accident">Accident</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea v-model="formData.description" placeholder="Describe the emergency..." rows="4" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Location</Label>
                            <Input v-model="formData.location" placeholder="Emergency location" />
                        </div>

                        <div>
                            <Label>Priority</Label>
                            <Select v-model="formData.priority">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </form>
            </DialogBody>

            <DialogFooter>
                <Button type="button" variant="outline" @click="isOpen = false">
                    Cancel
                </Button>
                <LoadingButton :loading="createMutation.isPending.value" class="bg-red-600 hover:bg-red-700"
                    @click="handleSubmit">
                    Create Alert
                </LoadingButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '~/components/ui/dialog'
import { Button, LoadingButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { emergencyApi } from '~/services/api/emergency.api'
import { queryKeys } from '~/constants/query-keys'

interface Props {
    open: boolean
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

const formData = reactive({
    userId: '',
    emergencyType: 'other',
    description: '',
    location: '',
    priority: 'high'
})

const resetForm = () => {
    Object.assign(formData, {
        userId: '',
        emergencyType: 'other',
        description: '',
        location: '',
        priority: 'high'
    })
}

watch(isOpen, (open) => {
    if (!open) resetForm()
})

const createMutation = useMutation({
    mutationFn: emergencyApi.createAlert,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
        toast.success('Emergency alert created successfully')
        emit('success')
        isOpen.value = false
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to create alert')
    }
})

const handleSubmit = () => {
    createMutation.mutate(formData)
}
</script>
