<template>
  <TabsRoot
    v-bind="forwarded"
    :class="cn('w-full', props.class)"
  >
    <slot />
  </TabsRoot>
</template>

<script setup lang="ts">
import { TabsRoot } from 'radix-vue'
import { cn } from '~/lib/utils'
import { useForwardPropsEmits } from 'radix-vue' // Corrected import path

const props = defineProps<{
  defaultValue?: string
  modelValue?: string
  orientation?: 'horizontal' | 'vertical'
  dir?: 'ltr' | 'rtl'
  activationMode?: 'automatic' | 'manual'
  class?: string
}>()

const emits = defineEmits<{
  'update:modelValue': [value: string]
}>()

const forwarded = useForwardPropsEmits(props, emits)
</script>
