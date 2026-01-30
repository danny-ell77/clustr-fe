<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl">Visitor Management</h1>
                <p class="text-muted-foreground">Register and manage visitors to the estate</p>
            </div>

            <Button @click="showRegisterDialog = true">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                Register Visitor
            </Button>
        </div>

        <StatPane v-if="!activeVisitorsQuery.isLoading.value" :stats="statsData" />

        <!-- Search bar with filter icon inside -->
        <div class="relative">
            <div class="relative">
                <Icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                    type="text" 
                    placeholder="Search visitors..." 
                    class="pl-10 pr-10"
                    @input="(e: Event) => setSearch((e.target as HTMLInputElement).value)" 
                />
                <button 
                    @click="showFilters = !showFilters"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Icon name="sliders" class="w-4 h-4 scale-x-[-1]" />
                </button>
            </div>

            <!-- Filter Dropdown -->
            <FilterDropdown v-model:open="showFilters">
                <div class="p-6 space-y-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold">Filters</h3>
                        <Button variant="ghost" size="sm" @click="clearFilters">Clear All</Button>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label class="text-sm">Status</Label>
                            <Select @update:model-value="(value) => setFilter('status', value)">
                                <SelectTrigger class="h-9">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                                    <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                    <SelectItem value="EXPIRED">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label class="text-sm">Visit Type</Label>
                            <Select @update:model-value="(value) => setFilter('visitType', value)">
                                <SelectTrigger class="h-9">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="ONE_TIME">One Time</SelectItem>
                                    <SelectItem value="SHORT_STAY">Short Stay</SelectItem>
                                    <SelectItem value="EXTENDED_STAY">Extended Stay</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label class="text-sm">Date</Label>
                            <Input type="date" class="h-9"
                                @change="(e: Event) => setFilter('date', (e.target as HTMLInputElement).value)" />
                        </div>

                        <div class="flex items-end">
                            <div class="text-sm text-muted-foreground">
                                {{ visitors.length }} of {{ visitorsQuery.data.value?.count || 0 }} results
                            </div>
                        </div>
                    </div>
                </div>
            </FilterDropdown>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card v-for="i in 6" :key="i">
                <CardContent class="pt-6">
                    <Skeleton class="h-48 w-full" />
                </CardContent>
            </Card>
        </div>

        <div v-else-if="visitors.length === 0" class="text-center py-12">
            <EmptyState title="No visitors found" description="Register your first visitor to get started"
                action-label="Register Visitor" @action="showRegisterDialog = true" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <VisitorCard v-for="visitor in visitors" :key="visitor.id" :visitor="visitor" @view="viewVisitor"
                @check-in="handleCheckIn" @check-out="handleCheckOut" @generate-pass="handleGeneratePass" />
        </div>

        <VisitorFormDialog v-model:open="showRegisterDialog" @success="onVisitorRegistered" />

        <VisitorPass v-if="selectedVisitor && showPassDialog" v-model:open="showPassDialog" :visitor="selectedVisitor"
            :qr-code="generatedQrCode" />

        <ConfirmDialog v-model:open="showCheckInDialog" title="Check In Visitor"
            description="Confirm that this visitor has arrived and is checking in." confirm-text="Check In"
            @confirm="confirmCheckIn" />

        <ConfirmDialog v-model:open="showCheckOutDialog" title="Check Out Visitor"
            description="Confirm that this visitor is leaving and checking out." confirm-text="Check Out"
            @confirm="confirmCheckOut" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { FilterDropdown } from '~/components/ui/filter-dropdown'
import Icon from '~/components/Icon.vue'
import StatPane from '~/components/common/StatPane.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import VisitorCard from '~/components/security/visitors/VisitorCard.vue'
import VisitorFormDialog from '~/components/security/visitors/VisitorFormDialog.vue'
import VisitorPass from '~/components/security/visitors/VisitorPass.vue'
import { useVisitors } from '~/composables/security/useVisitors'
import { useDataFilters } from '~/composables/useDataFilters'
import type { Visitor, VisitorStatus } from '~/types/visitors'
import type { VisitorFilters } from '~/services/api/visitors.api'

definePageMeta({
    title: 'Visitor Management'
})

const { useVisitors: useVisitorsList, useActiveVisitors, checkInMutation, checkOutMutation, generatePassMutation } = useVisitors()

const showFilters = ref(false)

const filterDefinitions = [
    { field: 'status', type: 'select' as const, label: 'Status' },
    { field: 'visitType', type: 'select' as const, label: 'Visit Type' },
    { field: 'date', type: 'date' as const, label: 'Date' },
    { field: 'search', type: 'text' as const, label: 'Search' }
]

const { currentQuery, setFilter, clearFilters, setSearch } = useDataFilters(filterDefinitions, {
    persistKey: 'visitors-filters'
})

const visitorsQuery = useVisitorsList(currentQuery as Ref<VisitorFilters>)
const activeVisitorsQuery = useActiveVisitors()

const visitors = computed(() => visitorsQuery.data.value?.results || [])
const activeVisitors = computed(() => activeVisitorsQuery.data.value || [])
const isLoading = computed(() => visitorsQuery.isLoading.value)

const todayCount = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return visitors.value.filter(v => v.validDate === today).length
})

const pendingCount = computed(() => {
    return visitors.value.filter(v => v.status === 'PENDING').length
})

const statsData = computed(() => [
    { title: 'Active Visitors', value: activeVisitors.value.length, color: '#0ea5e9' },
    { title: 'Total Today', value: todayCount.value, color: '#10b981' },
    { title: 'Pending Approval', value: pendingCount.value, color: '#eab308' }
])

const showRegisterDialog = ref(false)
const showPassDialog = ref(false)
const showCheckInDialog = ref(false)
const showCheckOutDialog = ref(false)
const selectedVisitor = ref<Visitor | null>(null)
const generatedQrCode = ref<string>('')

const viewVisitor = (visitor: Visitor) => {
    navigateTo(`/security/visitors/${visitor.id}`)
}

const handleCheckIn = (visitor: Visitor) => {
    selectedVisitor.value = visitor
    showCheckInDialog.value = true
}

const confirmCheckIn = async () => {
    if (!selectedVisitor.value) return
    await checkInMutation.mutateAsync({ id: selectedVisitor.value.id })
    showCheckInDialog.value = false
    selectedVisitor.value = null
}

const handleCheckOut = (visitor: Visitor) => {
    selectedVisitor.value = visitor
    showCheckOutDialog.value = true
}

const confirmCheckOut = async () => {
    if (!selectedVisitor.value) return
    await checkOutMutation.mutateAsync({ id: selectedVisitor.value.id })
    showCheckOutDialog.value = false
    selectedVisitor.value = null
}

const handleGeneratePass = async (visitor: Visitor) => {
    selectedVisitor.value = visitor
    const response = await generatePassMutation.mutateAsync(visitor.id)
    generatedQrCode.value = response.qr_code
    showPassDialog.value = true
}

const onVisitorRegistered = () => {
    showRegisterDialog.value = false
}
</script>
