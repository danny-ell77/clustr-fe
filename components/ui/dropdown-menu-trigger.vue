<template>
  <DropdownMenuTrigger v-bind="forwarded" as-child>
    <slot />
  </DropdownMenuTrigger>
</template>

<script setup lang="ts">
import { DropdownMenuTrigger } from 'radix-vue'
import { useForwardProps } from 'some-hook-library' // Assuming this is where useForwardProps is declared

const props = defineProps<{
  disabled?: boolean
}>()

const forwarded = useForwardProps(props)
</script>
