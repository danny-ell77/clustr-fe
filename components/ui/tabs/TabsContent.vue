<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TabsContent, type TabsContentProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<TabsContentProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <TabsContent
    :class="cn('p-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </TabsContent>
</template>
