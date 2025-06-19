<template>
  <SeparatorRoot
    v-bind="forwarded"
    :class="cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      props.class
    )"
  />
</template>

<script setup lang="ts">
import { Separator as SeparatorRoot } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useForwardProps } from 'radix-vue' // Corrected import path

const props = withDefaults(
  defineProps<{
    class?: string
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  }>(),
  {
    orientation: 'horizontal',
    decorative: true,
  }
)

const forwarded = useForwardProps(props)
</script>
