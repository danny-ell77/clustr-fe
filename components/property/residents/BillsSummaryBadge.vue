<template>
  <Badge :variant="badgeVariant">
    {{ badgeText }}
  </Badge>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

interface Props {
  paidCount: number
  totalCount: number
}

const props = defineProps<Props>()

const badgeText = computed(() => {
  if (props.totalCount === 0) return 'No Bills'
  return `${props.paidCount}/${props.totalCount} Paid`
})

const badgeVariant = computed(() => {
  if (props.totalCount === 0) return 'secondary'
  if (props.paidCount === props.totalCount) return 'default'
  if (props.paidCount === 0) return 'destructive'
  return 'outline'
})
</script>
