<template>
  <SelectRoot v-bind="forwarded">
    <slot />
  </SelectRoot>
</template>

<script setup lang="ts">
import { SelectRoot } from 'radix-vue'
import { useForwardPropsEmits } from 'radix-vue' // Corrected import path

const props = defineProps<{
  defaultValue?: string
  modelValue?: string
  open?: boolean
  defaultOpen?: boolean
  dir?: 'ltr' | 'rtl'
  name?: string
  autocomplete?: string
  size?: number
  disabled?: boolean
  required?: boolean
}>()

const emits = defineEmits<{
  'update:modelValue': [value: string]
  'update:open': [value: boolean]
}>()

const forwarded = useForwardPropsEmits(props, emits)
</script>
