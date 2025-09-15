<template>
  <div class="w-80 border-l bg-muted/10">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold">Notifications</h2>
        <Button variant="ghost" size="sm" @click="markAllAsRead">
          See all
        </Button>
      </div>

      <div class="space-y-4">
        <Card
          v-for="notification in notifications"
          :key="notification.id"
          :class="{'bg-muted/50': notification.read}"
        >
          <CardContent class="p-4">
            <div class="flex items-start space-x-3">
              <Avatar class="h-8 w-8 shrink-0">
                <AvatarImage :src="notification.author.avatar" />
                <AvatarFallback>{{ getInitials(notification.author.name) }}</AvatarFallback>
              </Avatar>
              <div>
                <p class="text-sm">
                  <span class="font-medium">{{ notification.author.name }}</span>
                  {{ notification.message }}
                </p>
                <p class="text-xs text-muted-foreground mt-1">
                  {{ formatTimeAgo(notification.createdAt) }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div 
          v-if="notifications.length === 0" 
          class="text-center py-8 text-sm text-muted-foreground"
        >
          No notifications
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { useFormatters } from '~/composables/useFormatters'

const { formatTimeAgo, getInitials } = useFormatters()

// Mock notifications - replace with real data from API
const notifications = ref([
  {
    id: 1,
    author: {
      name: 'John Doe',
      avatar: ''
    },
    message: 'commented on your announcement',
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    read: false
  },
  {
    id: 2,
    author: {
      name: 'Jane Smith',
      avatar: ''
    },
    message: 'liked your announcement',
    createdAt: new Date(Date.now() - 60 * 60000), // 1 hour ago
    read: true
  }
])

const markAllAsRead = () => {
  notifications.value = notifications.value.map(notification => ({
    ...notification,
    read: true
  }))
}
</script>

<style scoped>
.bg-muted\/10 {
  background-color: var(--muted);
  opacity: 0.1;
}

.bg-muted\/50 {
  background-color: var(--muted);
  opacity: 0.5;
}
</style>
