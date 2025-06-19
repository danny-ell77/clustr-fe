<template>
  <AvatarFallback
    v-bind="forwarded"
    :class="cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      props.class
    )"
  >
    <slot />
  </AvatarFallback>
</template>

<script setup lang="ts">
import { AvatarFallback } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useForwardProps } from '@/hooks/useForwardProps' // Declare the variable before using it

const props = defineProps<{
  class?: string
}>()

const forwarded = useForwardProps(props) // Ensure this hook is called at the top level
</script>
