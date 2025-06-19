<template>
  <SelectRoot v-bind="forwarded">
    <slot />
  </SelectRoot>
</template>

<script setup lang="ts">
import { SelectRoot } from 'radix-vue'
import { useForwardPropsEmits } from 'some-hook-library' // Import the useForwardPropsEmits hook

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

const forwarded = useForwardPropsEmits(props, emits) // Ensure this hook is called at the top level
</script>
