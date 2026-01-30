<template>
  <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="handleClick">
    <CardContent class="pt-6">
      <div class="space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <StatusBadge :status="announcement.status" show-icon />
              <PriorityBadge :priority="announcement.priority" />
              <Badge variant="outline" class="text-xs">
                {{ categoryLabel }}
              </Badge>
            </div>
            <h3 class="text-lg font-semibold line-clamp-2 mb-2">
              {{ announcement.title }}
            </h3>
            <p class="text-sm text-muted-foreground line-clamp-3">
              {{ announcement.content }}
            </p>
          </div>
          <Icon v-if="announcement.attachments?.length > 0" name="paperclip"
            class="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t">
          <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div class="flex items-center gap-1 whitespace-nowrap">
              <Icon name="user" class="w-4 h-4" />
              <span>{{ announcement.authorName }}</span>
            </div>
            <div class="flex items-center gap-1 whitespace-nowrap">
              <Icon name="calendar" class="w-4 h-4" />
              <span>{{ formattedDate }}</span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-sm">
            <div class="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
              <Icon name="eye" class="w-4 h-4" />
              <span>{{ announcement.viewsCount || 0 }}</span>
            </div>
            <div class="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
              <Icon name="heart" class="w-4 h-4" />
              <span>{{ announcement.likesCount || 0 }}</span>
            </div>
            <div class="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
              <Icon name="message-circle" class="w-4 h-4" />
              <span>{{ announcement.commentsCount || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'
import type { Announcement, AnnouncementCategory } from '~/types/announcements'

interface Props {
  announcement: Announcement
}

const props = defineProps < Props > ()
const emit = defineEmits < {
  click: [announcement: Announcement]
} > ()

const categoryLabels: Record<AnnouncementCategory, string> = {
  GENERAL: 'General',
  MAINTENANCE: 'Maintenance',
  SECURITY: 'Security',
  EVENT: 'Event',
  EMERGENCY: 'Emergency',
  BILLING: 'Billing',
  OTHER: 'Other'
}

const categoryLabel = computed(() => {
  return categoryLabels[props.announcement.category] || props.announcement.category
})

const formattedDate = computed(() => {
  const date = props.announcement.publishedAt || props.announcement.createdAt
  if (!date) return ''

  const d = new Date(date)
  const now = new Date()
  const diffInMs = now.getTime() - d.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
})

const handleClick = () => {
  emit('click', props.announcement)
}
</script>
