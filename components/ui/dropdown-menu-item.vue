<template>
  <DropdownMenuItem
    v-bind="forwarded"
    :class="cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      props.class
    )"
  >
    <slot />
  </DropdownMenuItem>
</template>

<script setup lang="ts">
import { DropdownMenuItem } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useForwardProps } from '@/hooks/useForwardProps' // Declare the variable before using it

const props = defineProps<{
  disabled?: boolean
  textValue?: string
  inset?: boolean
  class?: string
}>()

const forwarded = useForwardProps(props) // Ensure this hook is called at the top level
</script>
