<template>
    <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl">Maintenance Schedules</h1>
                <p class="text-muted-foreground">Manage recurring maintenance schedules</p>
            </div>
            <Button @click="showCreateDialog = true" class="bg-primary text-white">
                Create Schedule
            </Button>
        </div>

        <div class="bg-white border rounded-lg p-4 space-y-4">
            <MaintenanceSchedulesFilter v-model="filters" />

            <MaintenanceSchedulesTable
                :schedules="schedulesQuery.data.value?.results || []"
                :is-loading="schedulesQuery.isLoading.value"
                :is-error="schedulesQuery.isError.value"
                @retry="schedulesQuery.refetch()"
                @edit="editSchedule"
                @delete="deleteSchedule"
            />
            
            <div v-if="schedulesQuery.data.value?.count" class="flex items-center justify-between mt-4">
                <p class="text-sm text-muted-foreground">
                    Showing {{ schedulesQuery.data.value.results.length }} of {{ schedulesQuery.data.value.count }}
                    schedules
                </p>
                <div class="flex gap-2">
                    <Button @click="previousPage" :disabled="!schedulesQuery.data.value.previous" variant="outline"
                        size="sm">
                        Previous
                    </Button>
                    <Button @click="nextPage" :disabled="!schedulesQuery.data.value.next" variant="outline"
                        size="sm">
                        Next
                    </Button>
                </div>
            </div>
        </div>

        <ScheduleDialog v-model:open="showCreateDialog" @success="onScheduleCreated" />

        <ScheduleDialog v-if="selectedSchedule" v-model:open="showEditDialog" :schedule="selectedSchedule"
            @success="onScheduleUpdated" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { Button } from '~/components/ui/button'
import ScheduleDialog from '~/components/shift/maintenance/ScheduleDialog.vue'
import MaintenanceSchedulesFilter from '~/components/shift/maintenance/MaintenanceSchedulesFilter.vue'
import MaintenanceSchedulesTable from '~/components/shift/maintenance/MaintenanceSchedulesTable.vue'
import { maintenanceApi } from '~/services/api/maintenance.api'
import { queryKeys } from '~/constants/query-keys'
import type { MaintenanceSchedule } from '~/types/maintenance'

definePageMeta({
    title: 'Maintenance Schedules',
    description: 'Manage recurring maintenance schedules',
    requiresPermission: 'property.maintenance.view'
})

const router = useRouter()
const queryClient = useQueryClient()

const filters = reactive({
    search: '',
    frequency: '',
    page: 1
})

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const selectedSchedule = ref<MaintenanceSchedule | null>(null)

const schedulesQuery = useQuery({
    queryKey: computed(() => queryKeys.maintenance.schedules.list(filters)),
    queryFn: () => maintenanceApi.getSchedules(filters)
})

const viewSchedule = (id: string) => {
    router.push(`/shift/maintenance/schedules/${id}`)
}

const editSchedule = (schedule: MaintenanceSchedule) => {
    selectedSchedule.value = schedule
    showEditDialog.value = true
}

const onScheduleCreated = () => {
    showCreateDialog.value = false
}

const onScheduleUpdated = () => {
    showEditDialog.value = false
    selectedSchedule.value = null
}

const nextPage = () => {
    filters.page++
}

const previousPage = () => {
    if (filters.page > 1) {
        filters.page--
    }
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
}
</script>
