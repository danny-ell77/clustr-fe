<template>
    <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">Maintenance Schedules</h1>
                <p class="text-muted-foreground">Manage recurring maintenance schedules</p>
            </div>
            <Button @click="showCreateDialog = true" class="bg-blue-600 text-white">
                Create Schedule
            </Button>
        </div>

        <div class="bg-white border rounded-lg p-4 space-y-4">
            <div class="flex gap-4">
                <Input v-model="filters.search" placeholder="Search schedules..." class="max-w-sm" />
                <Select v-model="filters.frequency">
                    <SelectTrigger class="w-48">
                        <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Frequencies</SelectItem>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div v-if="schedulesQuery.isLoading.value" class="text-center py-8">
                <p class="text-muted-foreground">Loading schedules...</p>
            </div>

            <div v-else-if="schedulesQuery.isError.value" class="text-center py-8">
                <p class="text-red-600">Error loading schedules</p>
                <Button @click="schedulesQuery.refetch()" variant="outline" class="mt-4">
                    Retry
                </Button>
            </div>

            <div v-else>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Next Due</TableHead>
                            <TableHead>Property</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="schedule in schedulesQuery.data.value?.results" :key="schedule.id">
                            <TableCell class="font-medium">{{ schedule.title }}</TableCell>
                            <TableCell>{{ schedule.frequency }}</TableCell>
                            <TableCell>{{ formatDate(schedule.nextDueDate) }}</TableCell>
                            <TableCell>{{ schedule.propertyLocation }}</TableCell>
                            <TableCell>
                                <Badge :variant="schedule.isActive ? 'success' : 'secondary'">
                                    {{ schedule.isActive ? 'Active' : 'Inactive' }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div class="flex gap-2">
                                    <Button @click="viewSchedule(schedule.id)" variant="ghost" size="sm">
                                        View
                                    </Button>
                                    <Button @click="editSchedule(schedule)" variant="ghost" size="sm">
                                        Edit
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow v-if="!schedulesQuery.data.value?.results?.length">
                            <TableCell colspan="6" class="text-center py-8 text-muted-foreground">
                                No schedules found
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

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
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { maintenanceApi } from '~/services/api/maintenance.api'
import { queryKeys } from '~/constants/query-keys'

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

const schedulesQuery = useQuery({
    queryKey: computed(() => queryKeys.maintenance.schedules.list(filters)),
    queryFn: () => maintenanceApi.getSchedules(filters)
})

const viewSchedule = (id: string) => {
    router.push(`/property/maintenance/schedules/${id}`)
}

const editSchedule = (schedule: any) => {
    console.log('Edit schedule:', schedule)
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
