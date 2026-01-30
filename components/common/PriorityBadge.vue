<template>
  <Badge :variant="badgeVariant" :class="badgeClass">
    <!-- <Icon :name="priorityIcon" class="w-3 h-3 mr-1" /> -->
    {{ label }}
  </Badge>
</template>

<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'
import { PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_ICONS } from '~/constants/management'

interface Props {
  priority: string
}

const props = defineProps<Props>()

const label = computed(() => {
  return PRIORITY_LABELS[props.priority as keyof typeof PRIORITY_LABELS] || props.priority
})

const badgeVariant = computed(() => {
  const color = PRIORITY_COLORS[props.priority as keyof typeof PRIORITY_COLORS]
  
  const variantMap: Record<string, any> = {
    gray: 'secondary',
    blue: 'default',
    orange: 'warning',
    red: 'destructive'
  }
  
  return variantMap[color] || 'default'
})

const badgeClass = computed(() => {
  const color = PRIORITY_COLORS[props.priority as keyof typeof PRIORITY_COLORS]
  
  const classMap: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    blue: 'bg-primary/15 text-primary hover:bg-primary/90/15',
    orange: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    red: 'bg-red-100 text-red-800 hover:bg-red-100'
  }
  
  return classMap[color] || ''
})

const priorityIcon = computed(() => {
  return PRIORITY_ICONS[props.priority as keyof typeof PRIORITY_ICONS] || 'minus'
})
</script>
