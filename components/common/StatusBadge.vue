<template>
  <Badge :variant="badgeVariant" :class="badgeClass">
    <Icon v-if="showIcon" :name="statusIcon" class="w-3 h-3 mr-1" />
    {{ label }}
  </Badge>
</template>

<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'
import { STATUS_COLORS, STATUS_LABELS } from '~/constants/management'

interface Props {
  status: string
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: false
})

const label = computed(() => {
  return STATUS_LABELS[props.status as keyof typeof STATUS_LABELS] || props.status
})

const badgeVariant = computed(() => {
  const color = STATUS_COLORS[props.status as keyof typeof STATUS_COLORS]
  
  const variantMap: Record<string, any> = {
    blue: 'default',
    green: 'success',
    yellow: 'warning',
    red: 'destructive',
    gray: 'secondary',
    orange: 'warning'
  }
  
  return variantMap[color] || 'default'
})

const badgeClass = computed(() => {
  const color = STATUS_COLORS[props.status as keyof typeof STATUS_COLORS]
  
  const classMap: Record<string, string> = {
    blue: 'bg-primary/15 text-primary hover:bg-primary/90/15',
    green: 'bg-green-100 text-green-800 hover:bg-green-100',
    yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    red: 'bg-red-100 text-red-800 hover:bg-red-100',
    gray: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    orange: 'bg-orange-100 text-orange-800 hover:bg-orange-100'
  }
  
  return classMap[color] || ''
})

const statusIcon = computed(() => {
  const iconMap: Record<string, string> = {
    PENDING: 'clock',
    IN_PROGRESS: 'loader',
    COMPLETED: 'check-circle',
    RESOLVED: 'check-circle',
    CLOSED: 'x-circle',
    CANCELLED: 'x-circle',
    OPEN: 'folder-open',
    ACTIVE: 'check',
    INACTIVE: 'x',
    DRAFT: 'file-text',
    PUBLISHED: 'send',
    APPROVED: 'check',
    DENIED: 'x',
    EXPIRED: 'alert-circle'
  }
  
  return iconMap[props.status] || 'circle'
})
</script>
