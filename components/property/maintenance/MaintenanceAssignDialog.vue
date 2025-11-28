<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>Assign Maintenance Log</DialogTitle>
                <DialogDescription>
                    Assign this maintenance task to staff members
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div v-if="log" class="p-4 bg-muted rounded-lg">
                    <p class="text-sm font-medium">{{ log.title }}</p>
                    <p class="text-xs text-muted-foreground mt-1">{{ log.maintenanceNumber }}</p>
                </div>

                <div>
                    <Label for="performedBy">Performed By</Label>
                    <Select v-model="formData.performedBy">
                        <SelectTrigger id="performedBy">
                            <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            <SelectItem v-for="staff in staffMembers" :key="staff.id" :value="staff.id">
                                {{ staff.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p v-if="isLoadingStaff" class="text-xs text-muted-foreground mt-1">
                        Loading staff members...
                    </p>
                </div>

                <div>
                    <Label for="supervisedBy">Supervised By</Label>
                    <Select v-model="formData.supervisedBy">
                        <SelectTrigger id="supervisedBy">
                            <SelectValue placeholder="Select supervisor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            <SelectItem v-for="staff in staffMembers" :key="staff.id" :value="staff.id">
                                {{ staff.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" @click="isOpen = false" :disabled="isSubmitting">
                        Cancel
                    </Button>
                    <Button type="submit" :disabled="isSubmitting || (!formData.performedBy && !formData.supervisedBy)">
                        {{ isSubmitting ? 'Assigning...' : 'Assign' }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useMaintenance } from '~/composables/property/useMaintenance'
import { usersApi } from '~/services/api/users.api'
import { queryKeys } from '~/constants/query-keys'
import type { MaintenanceLog } from '~/types/maintenance'

interface Props {
    open: boolean
    log?: MaintenanceLog
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'update:open': [value: boolean]
    'success': []
}>()

const { assignLogMutation } = useMaintenance()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const formData = reactive({
    performedBy: '',
    supervisedBy: ''
})

const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: queryKeys.users.list({ isClusterStaff: true }),
    queryFn: () => usersApi.getAll({ isClusterStaff: true, pageSize: 100 })
})

const staffMembers = computed(() => staffData.value?.results || [])

const isSubmitting = computed(() => assignLogMutation.isPending.value)

watch(() => props.open, (open) => {
    if (open && props.log) {
        formData.performedBy = props.log.performedBy?.id || ''
        formData.supervisedBy = props.log.supervisedBy?.id || ''
    } else if (!open) {
        formData.performedBy = ''
        formData.supervisedBy = ''
    }
})

const handleSubmit = async () => {
    if (!props.log) return

    try {
        await assignLogMutation.mutateAsync({
            id: props.log.id,
            assignedTo: formData.performedBy || formData.supervisedBy
        })
        emit('success')
        isOpen.value = false
    } catch (error) {
        console.error('Failed to assign maintenance log:', error)
    }
}
</script>
