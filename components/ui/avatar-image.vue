<template>
  <AvatarImage
    v-bind="forwarded"
    :class="cn('aspect-square h-full w-full', props.class)"
  />
</template>

<script setup lang="ts">
import { AvatarImage } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useForwardProps } from '@/hooks/useForwardProps'

const props = defineProps<{
  class?: string
  src?: string
  alt?: string
}>()

const forwarded = useForwardProps(props)
</script>
