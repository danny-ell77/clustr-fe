<template>
  <DropdownMenuRoot v-bind="forwarded">
    <slot />
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import { DropdownMenuRoot } from 'radix-vue'
import { useForwardPropsEmits } from 'radix-vue' // Corrected import path

const props = defineProps<{
  defaultOpen?: boolean
  open?: boolean
  dir?: 'ltr' | 'rtl'
  modal?: boolean
}>()

const emits = defineEmits<{
  'update:open': [value: boolean]
}>()

const forwarded = useForwardPropsEmits(props, emits)
</script>
