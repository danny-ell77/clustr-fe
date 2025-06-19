<template>
  <TabsTrigger
    v-bind="forwarded"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      props.class
    )"
  >
    <slot />
  </TabsTrigger>
</template>

<script setup lang="ts">
import { TabsTrigger } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useForwardProps } from '@/hooks/useForwardProps' // Declare the useForwardProps hook

const props = defineProps<{
  value: string
  disabled?: boolean
  class?: string
}>()

const forwarded = useForwardProps(props) // Ensure this hook is called at the top level
</script>
