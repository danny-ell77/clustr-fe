<template>
  <Tabs>
    <TabsContent
      v-bind="forwarded"
      :class="cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.class
      )"
    >
      <slot />
    </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import { TabsContent, Tabs } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useForwardProps } from '@/hooks/useForwardProps'

const props = defineProps<{
  value: string
  forceMount?: boolean
  class?: string
}>()

const forwarded = useForwardProps(props)
</script>
