<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Comments</h3>
            <span class="text-sm text-muted-foreground">{{ comments.length }} comments</span>
        </div>

        <form @submit.prevent="handleAddComment" class="space-y-2">
            <Textarea v-model="newComment" placeholder="Add a comment..." rows="3" :disabled="isSubmitting" />
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Checkbox id="internal" v-model:checked="isInternal" />
                    <Label for="internal" class="text-sm cursor-pointer">
                        Internal note (not visible to reporter)
                    </Label>
                </div>
                <Button type="submit" size="sm" :disabled="!newComment.trim() || isSubmitting">
                    {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
                </Button>
            </div>
        </form>

        <Separator />

        <div v-if="isLoading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex gap-3">
                <Skeleton class="h-10 w-10 rounded-full" />
                <div class="flex-1 space-y-2">
                    <Skeleton class="h-4 w-32" />
                    <Skeleton class="h-16 w-full" />
                </div>
            </div>
        </div>

        <div v-else-if="comments.length === 0" class="text-center py-8">
            <p class="text-muted-foreground">No comments yet</p>
        </div>

        <div v-else class="space-y-4">
            <CommentItem v-for="comment in topLevelComments" :key="comment.id" :comment="comment" :ticket-id="ticketId"
                @reply="handleReply" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import CommentItem from '~/components/portal/helpdesk/CommentItem.vue'
import { useHelpdesk } from '~/composables/portal/useHelpdesk'
import { helpdeskApi } from '~/services/api/helpdesk.api'
import { queryKeys } from '~/constants/query-keys'
import type { IssueComment } from '~/types/helpdesk'

interface Props {
    ticketId: string
}

const props = defineProps<Props>()

const { addCommentMutation } = useHelpdesk()

const newComment = ref('')
const isInternal = ref(false)
const replyingTo = ref<string | undefined>()

const { data: commentsData, isLoading } = useQuery({
    queryKey: computed(() => queryKeys.helpdesk.comments(props.ticketId)),
    queryFn: () => helpdeskApi.comments.getAll(props.ticketId)
})

const comments = computed(() => commentsData.value || [])

const topLevelComments = computed(() =>
    comments.value.filter(comment => !comment.parent)
)

const isSubmitting = computed(() => addCommentMutation.isPending.value)

const handleAddComment = async () => {
    if (!newComment.value.trim()) return

    try {
        await addCommentMutation.mutateAsync({
            issueId: props.ticketId,
            data: {
                content: newComment.value,
                isInternal: isInternal.value,
                parent: replyingTo.value
            }
        })
        newComment.value = ''
        isInternal.value = false
        replyingTo.value = undefined
    } catch (error) {
        console.error('Failed to add comment:', error)
    }
}

const handleReply = (commentId: string) => {
    replyingTo.value = commentId
}
</script>
