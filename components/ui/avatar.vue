<template>
  <AvatarRoot
    v-bind="forwarded"
    :class="cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      props.class
    )"
  >
    <slot />
  </AvatarRoot>
</template>

<script setup lang="ts">
import { AvatarRoot } from 'radix-vue'
import { cn } from '~/lib/utils'
import { useForwardProps } from 'radix-vue' // Corrected import path

const props = defineProps<{
  class?: string
}>()

const forwarded = useForwardProps(props)
</script>
