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
import { cn } from '~/lib/utils'
import { useForwardProps } from 'radix-vue' // Corrected import path

const props = defineProps<{
  class?: string
}>()

const forwarded = useForwardProps(props)
</script>
