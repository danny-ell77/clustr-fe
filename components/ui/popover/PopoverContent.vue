<template>
    <div v-if="open" :class="cn(
        'absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md',
        'animate-in fade-in-0 zoom-in-95',
        alignClass,
        props.class
    )" :style="contentStyle">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
    open?: boolean
    align?: 'start' | 'center' | 'end'
    side?: 'top' | 'right' | 'bottom' | 'left'
    sideOffset?: number
    class?: string
}>(), {
    open: false,
    align: 'center',
    side: 'bottom',
    sideOffset: 4
})

const alignClass = computed(() => {
    const classes: Record<string, string> = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0'
    }
    return classes[props.align] || classes.center
})

const contentStyle = computed(() => {
    const styles: Record<string, string> = {
        top: `bottom: calc(100% + ${props.sideOffset}px)`,
        bottom: `top: calc(100% + ${props.sideOffset}px)`,
        left: `right: calc(100% + ${props.sideOffset}px)`,
        right: `left: calc(100% + ${props.sideOffset}px)`
    }
    return styles[props.side] || styles.bottom
})
</script>
