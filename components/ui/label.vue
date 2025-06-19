<template>
  <LabelPrimitive
    :class="cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      $attrs.class
    )"
    v-bind="forwarded"
  >
    <slot />
  </LabelPrimitive>
</template>

<script setup lang="ts">
import { Label as LabelPrimitive } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useForwardProps } from 'radix-vue' // Corrected import path

const props = defineProps<{
  class?: string
}>()

const forwarded = useForwardProps(props)
</script>
