<template>
    <div class="flex gap-3" :class="{ 'ml-12': isReply }">
        <Avatar class="h-10 w-10">
            <AvatarFallback>{{ authorInitials }}</AvatarFallback>
        </Avatar>

        <div class="flex-1 space-y-2">
            <div class="flex items-center gap-2">
                <span class="font-medium text-sm">{{ comment.author.name }}</span>
                <span class="text-xs text-muted-foreground">{{ formatDate(comment.createdAt) }}</span>
                <Badge v-if="comment.isInternal" variant="secondary" class="text-xs">
                    Internal
                </Badge>
            </div>

            <div class="text-sm whitespace-pre-wrap">{{ comment.content }}</div>

            <div v-if="comment.attachments.length > 0" class="flex flex-wrap gap-2">
                <div v-for="attachment in comment.attachments" :key="attachment.id"
                    class="flex items-center gap-2 px-3 py-2 bg-muted rounded text-xs">
                    <Icon name="paperclip" class="w-3 h-3" />
                    <span>{{ attachment.fileName }}</span>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <Button variant="ghost" size="sm" class="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    @click="$emit('reply', comment.id)">
                    Reply
                </Button>
                <span v-if="comment.replies.length > 0" class="text-xs text-muted-foreground">
                    {{ comment.replies.length }} {{ comment.replies.length === 1 ? 'reply' : 'replies' }}
                </span>
            </div>

            <div v-if="comment.replies.length > 0" class="space-y-4 mt-4">
                <CommentItem v-for="reply in comment.replies" :key="reply.id" :comment="reply" :ticket-id="ticketId"
                    :is-reply="true" @reply="$emit('reply', $event)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import type { IssueComment } from '~/types/helpdesk'

interface Props {
    comment: IssueComment
    ticketId: string
    isReply?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isReply: false
})

defineEmits<{
    reply: [commentId: string]
}>()

const authorInitials = computed(() => {
    const name = props.comment.author.name
    const parts = name.split(' ')
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
})

const formatDate = (date: string) => {
    const now = new Date()
    const commentDate = new Date(date)
    const diffMs = now.getTime() - commentDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return commentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: commentDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
}
</script>
