<template>
    <div class="helpdesk-management">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Helpdesk</h1>
                <p class="text-muted-foreground">Manage and track issue tickets</p>
            </div>

            <div class="flex items-center space-x-3">
                <Button @click="showCreateModal = true" class="bg-blue-600 hover:bg-blue-700">
                    <Icon name="plus" class="w-4 h-4 mr-2" />
                    Create Issue
                </Button>
            </div>
        </div>

        <Card class="mb-6">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label>Status</Label>
                        <Select @update:model-value="(value) => filters.setFilter('status', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Statuses</SelectItem>
                                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                                <SelectItem value="OPEN">Open</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select @update:model-value="(value) => filters.setFilter('type', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Types</SelectItem>
                                <SelectItem value="CARPENTRY">Carpentry</SelectItem>
                                <SelectItem value="PLUMBING">Plumbing</SelectItem>
                                <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                                <SelectItem value="CLEANING">Cleaning</SelectItem>
                                <SelectItem value="SECURITY">Security</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Priority</Label>
                        <Select @update:model-value="(value) => filters.setFilter('priority', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Priorities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Priorities</SelectItem>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="URGENT">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search issues..."
                            @input="(e: Event) => filters.setFilter('search', (e.target as HTMLInputElement).value)" />
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4 pt-4 border-t">
                    <div class="text-sm text-muted-foreground">
                        Showing {{ issuesData?.results?.length || 0 }} issues
                    </div>

                    <Button variant="outline" size="sm" @click="filters.clearFilters">
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <GenericTable :data="issuesData?.results || []" :columns="tableColumns" :row-actions="tableActions"
                :loading="loading" :enable-search="false" empty-message="No issues found" @view="viewIssue"
                @edit="editIssue" @assign="showAssignModal">

                <template #custom-cell-issueNo="{ row }">
                    <span class="font-mono text-sm">{{ row.issueNo }}</span>
                </template>

                <template #custom-cell-priority="{ row }">
                    <span :class="getPriorityClass(row.priority)" class="px-2 py-1 rounded text-xs font-medium">
                        {{ row.priority }}
                    </span>
                </template>

                <template #custom-cell-status="{ row }">
                    <span :class="getStatusClass(row.status)" class="px-2 py-1 rounded text-xs font-medium">
                        {{ row.status }}
                    </span>
                </template>

                <template #custom-cell-issueType="{ row }">
                    <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                        {{ row.issueType }}
                    </span>
                </template>
            </GenericTable>
        </Card>

        <Dialog v-model:open="showCreateModal">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Issue</DialogTitle>
                    <DialogDescription>
                        Create a new issue ticket
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleCreate" class="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input v-model="formData.title" required />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <textarea v-model="formData.description"
                            class="w-full min-h-[120px] px-3 py-2 border rounded-md" required />
                    </div>

                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Type</Label>
                            <Select v-model="formData.issueType">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CARPENTRY">Carpentry</SelectItem>
                                    <SelectItem value="PLUMBING">Plumbing</SelectItem>
                                    <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                                    <SelectItem value="CLEANING">Cleaning</SelectItem>
                                    <SelectItem value="SECURITY">Security</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Priority</Label>
                            <Select v-model="formData.priority">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="URGENT">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Status</Label>
                            <Select v-model="formData.status">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                                    <SelectItem value="OPEN">Open</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" @click="showCreateModal = false">
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="createMutation.isPending.value">
                            {{ createMutation.isPending.value ? 'Creating...' : 'Create' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showEditModal">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Issue</DialogTitle>
                    <DialogDescription>
                        Update issue details
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleUpdate" class="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input v-model="editFormData.title" required />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <textarea v-model="editFormData.description"
                            class="w-full min-h-[120px] px-3 py-2 border rounded-md" required />
                    </div>

                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Type</Label>
                            <Select v-model="editFormData.issueType">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CARPENTRY">Carpentry</SelectItem>
                                    <SelectItem value="PLUMBING">Plumbing</SelectItem>
                                    <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                                    <SelectItem value="CLEANING">Cleaning</SelectItem>
                                    <SelectItem value="SECURITY">Security</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Priority</Label>
                            <Select v-model="editFormData.priority">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="URGENT">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Status</Label>
                            <Select v-model="editFormData.status">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                                    <SelectItem value="OPEN">Open</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" @click="showEditModal = false">
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="updateMutation.isPending.value">
                            {{ updateMutation.isPending.value ? 'Updating...' : 'Update' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showAssignModalOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Issue</DialogTitle>
                    <DialogDescription>
                        Assign this issue to a staff member
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleAssign" class="space-y-4">
                    <div>
                        <Label>Assign To</Label>
                        <Input v-model="assignFormData.assignedTo" placeholder="Staff member ID" required />
                    </div>

                    <div class="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" @click="showAssignModalOpen = false">
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="assignMutation.isPending.value">
                            {{ assignMutation.isPending.value ? 'Assigning...' : 'Assign' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { helpdeskApi, type IssueTicket } from '~/services/api/helpdesk.api'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import GenericTable from '~/components/shared/GenericTable.vue'
import Icon from '~/components/Icon.vue'

const queryClient = useQueryClient()
const toast = useToast()

definePageMeta({
    title: 'Helpdesk',
    middleware: ['auth', 'permissions'],
    layout: 'default'
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showAssignModalOpen = ref(false)
const selectedIssueId = ref<string | null>(null)

const filterDefinitions = [
    {
        field: 'status',
        type: 'select' as const,
        label: 'Status',
        options: [
            { value: 'SUBMITTED', label: 'Submitted' },
            { value: 'OPEN', label: 'Open' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'RESOLVED', label: 'Resolved' },
            { value: 'CLOSED', label: 'Closed' }
        ]
    },
    {
        field: 'type',
        type: 'select' as const,
        label: 'Type',
        options: [
            { value: 'CARPENTRY', label: 'Carpentry' },
            { value: 'PLUMBING', label: 'Plumbing' },
            { value: 'ELECTRICAL', label: 'Electrical' },
            { value: 'CLEANING', label: 'Cleaning' },
            { value: 'SECURITY', label: 'Security' },
            { value: 'OTHER', label: 'Other' }
        ]
    },
    {
        field: 'priority',
        type: 'select' as const,
        label: 'Priority',
        options: [
            { value: 'LOW', label: 'Low' },
            { value: 'MEDIUM', label: 'Medium' },
            { value: 'HIGH', label: 'High' },
            { value: 'URGENT', label: 'Urgent' }
        ]
    }
]

const filters = useDataFilters(filterDefinitions, {
    persistKey: 'helpdesk-filters'
})

const issuesQuery = useQuery({
    queryKey: computed(() => queryKeys.helpdesk.issues.list(filters.currentQuery.value)),
    queryFn: () => helpdeskApi.getIssues(filters.currentQuery.value)
})

const formData = reactive({
    title: '',
    description: '',
    issueType: 'OTHER' as IssueTicket['issueType'],
    priority: 'MEDIUM' as IssueTicket['priority'],
    status: 'SUBMITTED' as IssueTicket['status']
})

const editFormData = reactive({
    title: '',
    description: '',
    issueType: 'OTHER' as IssueTicket['issueType'],
    priority: 'MEDIUM' as IssueTicket['priority'],
    status: 'SUBMITTED' as IssueTicket['status']
})

const assignFormData = reactive({
    assignedTo: ''
})

const createMutation = useMutation({
    mutationFn: helpdeskApi.createIssue,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.all() })
        showCreateModal.value = false
        Object.assign(formData, {
            title: '',
            description: '',
            issueType: 'OTHER',
            priority: 'MEDIUM',
            status: 'SUBMITTED'
        })
        toast.success('Issue created successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to create issue')
    }
})

const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IssueTicket> }) =>
        helpdeskApi.updateIssue(id, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.all() })
        if (selectedIssueId.value) {
            queryClient.invalidateQueries({
                queryKey: queryKeys.helpdesk.issues.detail(selectedIssueId.value)
            })
        }
        showEditModal.value = false
        toast.success('Issue updated successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to update issue')
    }
})

const assignMutation = useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string }) =>
        helpdeskApi.assignIssue(id, assigneeId),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.all() })
        if (selectedIssueId.value) {
            queryClient.invalidateQueries({
                queryKey: queryKeys.helpdesk.issues.detail(selectedIssueId.value)
            })
        }
        showAssignModalOpen.value = false
        assignFormData.assignedTo = ''
        toast.success('Issue assigned successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to assign issue')
    }
})

const issuesData = computed(() => issuesQuery.data.value)
const loading = computed(() => issuesQuery.isLoading.value)

const tableColumns = [
    { key: 'issueNo', label: 'Issue #', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'issueType', label: 'Type', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true }
]

const tableActions = computed(() => [
    { key: 'view', label: 'View', icon: 'eye' },
    { key: 'edit', label: 'Edit', icon: 'edit-2' },
    { key: 'assign', label: 'Assign', icon: 'user-plus' }
])

const viewIssue = (issue: IssueTicket) => {
    navigateTo(`/portal/helpdesk/${issue.id}`)
}

const editIssue = (issue: IssueTicket) => {
    selectedIssueId.value = issue.id
    Object.assign(editFormData, {
        title: issue.title,
        description: issue.description,
        issueType: issue.issueType,
        priority: issue.priority,
        status: issue.status
    })
    showEditModal.value = true
}

const showAssignModal = (issue: IssueTicket) => {
    selectedIssueId.value = issue.id
    showAssignModalOpen.value = true
}

const handleCreate = () => {
    createMutation.mutate(formData)
}

const handleUpdate = () => {
    if (!selectedIssueId.value) return
    updateMutation.mutate({
        id: selectedIssueId.value,
        data: editFormData
    })
}

const handleAssign = () => {
    if (!selectedIssueId.value) return
    assignMutation.mutate({
        id: selectedIssueId.value,
        assigneeId: assignFormData.assignedTo
    })
}

const getPriorityClass = (priority: string) => {
    const classes = {
        LOW: 'bg-gray-100 text-gray-800',
        MEDIUM: 'bg-blue-100 text-blue-800',
        HIGH: 'bg-orange-100 text-orange-800',
        URGENT: 'bg-red-100 text-red-800'
    }
    return classes[priority as keyof typeof classes] || classes.MEDIUM
}

const getStatusClass = (status: string) => {
    const classes = {
        SUBMITTED: 'bg-yellow-100 text-yellow-800',
        OPEN: 'bg-blue-100 text-blue-800',
        IN_PROGRESS: 'bg-purple-100 text-purple-800',
        PENDING: 'bg-orange-100 text-orange-800',
        RESOLVED: 'bg-green-100 text-green-800',
        CLOSED: 'bg-gray-100 text-gray-800'
    }
    return classes[status as keyof typeof classes] || classes.OPEN
}
</script>
