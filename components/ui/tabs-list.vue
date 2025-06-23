<template>
  <TabsList
    v-bind="forwarded"
    :class="cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      props.class
    )"
  >
    <slot />
  </TabsList>
</template>

<script setup lang="ts">
import { TabsList } from 'radix-vue'
import { cn } from '~/lib/utils'
import { useForwardProps } from 'radix-vue' // Corrected import path

const props = defineProps<{
  loop?: boolean
  class?: string
}>()

const forwarded = useForwardProps(props)
</script>
