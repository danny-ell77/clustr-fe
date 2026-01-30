<template>
    <div @click="handleClick">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

defineProps<{
    asChild?: boolean
}>()

const popover = inject<{
    isOpen: { value: boolean }
    toggle: () => void
    close: () => void
}>('popover')

const handleClick = () => {
    popover?.toggle()
}
</script>
