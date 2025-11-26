<template>
    <div class="issue-detail">
        <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-muted-foreground">Loading issue...</div>
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
            <div class="text-red-600 mb-4">{{ error.message || 'Failed to load issue' }}</div>
            <Button @click="handleRetry">Retry</Button>
        </div>

        <div v-else>
            <div class="mb-6 flex items-center justify-between">
                <h1 class="text-2xl font-bold">Issue Details</h1>
                <div class="flex gap-2">
                    <Button variant="outline" @click="showEditModal = true">
                        <Icon name="edit-2" class="w-4 h-4 mr-2" />
                        Edit
                    </Button>

                    <Button variant="outline" @click="showAssignModal = true">
                        <Icon name="user-plus" class="w-4 h-4 mr-2" />
                        Assign
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-2">
                                <span class="font-mono text-sm text-muted-foreground">{{ issue.issueNo }}</span>
                                <span :class="getPriorityClass(issue.priority)"
                                    class="px-2 py-1 rounded text-xs font-medium">
                                    {{ issue.priority }}
                                </span>
                                <span :class="getStatusClass(issue.status)"
                                    class="px-2 py-1 rounded text-xs font-medium">
                                    {{ issue.status }}
                                </span>
                                <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                                    {{ issue.issueType }}
                                </span>
                            </div>
                            <CardTitle class="text-3xl mb-2">{{ issue.title }}</CardTitle>
                            <div class="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>Created: {{ formatDate(issue.createdAt) }}</span>
                                <span v-if="issue.reportedBy">
                                    Reported by: {{ issue.reportedBy.name || issue.reportedBy.email }}
                                </span>
                                <span v-if="issue.assignedTo">
                                    Assigned to: {{ issue.assignedTo.name || issue.assignedTo.email }}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div class="prose max-w-none">
                        <p class="whitespace-pre-wrap">{{ issue.description }}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div v-if="commentsLoading" class="text-center py-4 text-muted-foreground">
                        Loading comments...
                    </div>

                    <div v-else-if="commentsError" class="text-center py-4">
                        <div class="text-red-600 mb-2">Failed to load comments</div>
                        <Button size="sm" @click="() => refetchComments()">Retry</Button>
                    </div>

                    <div v-else-if="comments && comments.length > 0" class="space-y-4">
                        <div v-for="comment in comments" :key="comment.id" class="border rounded-lg p-4">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex items-center space-x-2">
                                    <span class="font-semibold">
                                        {{ comment.createdBy?.name || comment.createdBy?.email || 'Unknown' }}
                                    </span>
                                    <span class="text-sm text-muted-foreground">
                                        {{ formatDate(comment.createdAt) }}
                                    </span>
                                </div>
                            </div>
                            <p class="text-foreground whitespace-pre-wrap">{{ comment.content }}</p>
                        </div>
                    </div>

                    <div v-else class="text-center py-8 text-muted-foreground">
                        No comments yet
                    </div>

                    <div class="mt-6 pt-6 border-t">
                        <form @submit.prevent="handleAddComment" class="space-y-3">
                            <div>
                                <Label>Add Comment</Label>
                                <textarea v-model="commentContent"
                                    class="w-full min-h-[100px] px-3 py-2 border rounded-md"
                                    placeholder="Write a comment..." required />
                            </div>
                            <div class="flex justify-end">
                                <Button type="submit" :disabled="addCommentMutation.isPending.value">
                                    {{ addCommentMutation.isPending.value ? 'Adding...' : 'Add Comment' }}
                                </Button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>

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

        <Dialog v-model:open="showAssignModal">
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
                        <Button type="button" variant="outline" @click="showAssignModal = false">
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
import { ref, computed, reactive, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { helpdeskApi, type IssueTicket } from '~/services/api/helpdesk.api'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Icon from '~/components/Icon.vue'

const route = useRoute()
const queryClient = useQueryClient()
const toast = useToast()

definePageMeta({
    title: 'Issue Details',
    middleware: ['auth', 'permissions'],
    layout: 'default'
})

const showEditModal = ref(false)
const showAssignModal = ref(false)
const commentContent = ref('')

const issueId = computed(() => route.params.id as string)

const { data: issue, isLoading: loading, error, refetch } = useQuery({
    queryKey: computed(() => queryKeys.helpdesk.issues.detail(issueId.value)),
    queryFn: () => helpdeskApi.getIssueById(issueId.value),
    enabled: computed(() => !!issueId.value)
})

const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments
} = useQuery({
    queryKey: computed(() => queryKeys.helpdesk.comments(issueId.value)),
    queryFn: () => helpdeskApi.getIssueComments(issueId.value),
    enabled: computed(() => !!issueId.value)
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

watch(issue, (newIssue) => {
    if (newIssue) {
        Object.assign(editFormData, {
            title: newIssue.title,
            description: newIssue.description,
            issueType: newIssue.issueType,
            priority: newIssue.priority,
            status: newIssue.status
        })
    }
})

const handleRetry = () => {
    refetch()
}

const updateMutation = useMutation({
    mutationFn: (data: Partial<IssueTicket>) =>
        helpdeskApi.updateIssue(issueId.value, data),
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: queryKeys.helpdesk.issues.detail(issueId.value)
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.all() })
        showEditModal.value = false
        toast.success('Issue updated successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to update issue')
    }
})

const assignMutation = useMutation({
    mutationFn: (assigneeId: string) =>
        helpdeskApi.assignIssue(issueId.value, assigneeId),
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: queryKeys.helpdesk.issues.detail(issueId.value)
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.all() })
        showAssignModal.value = false
        assignFormData.assignedTo = ''
        toast.success('Issue assigned successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to assign issue')
    }
})

const addCommentMutation = useMutation({
    mutationFn: (content: string) =>
        helpdeskApi.addIssueComment(issueId.value, content),
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: queryKeys.helpdesk.comments(issueId.value)
        })
        commentContent.value = ''
        toast.success('Comment added successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to add comment')
    }
})

const handleUpdate = () => {
    updateMutation.mutate(editFormData)
}

const handleAssign = () => {
    assignMutation.mutate(assignFormData.assignedTo)
}

const handleAddComment = () => {
    if (!commentContent.value.trim()) return
    addCommentMutation.mutate(commentContent.value)
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

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>
