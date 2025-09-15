<template>
  <Card>
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-sm">Notifications</CardTitle>
        <Button variant="ghost" size="sm" class="text-xs text-blue-600" @click="$emit('seeAll')">
          See all
        </Button>
      </div>
    </CardHeader>
    <CardContent class="space-y-3">
      <div 
        v-for="notification in notifications" 
        :key="notification.id" 
        class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        @click="$emit('notificationClick', notification)"
      >
        <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900">{{ notification.message }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
        </div>
      </div>
      
      <div v-if="notifications.length === 0" class="text-center py-4 text-gray-500 text-sm">
        No notifications
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Button } from '~/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '~/components/ui/card'

defineProps({
  notifications: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['seeAll', 'notificationClick'])
</script>