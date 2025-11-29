<template>
    <div @click="$emit('click', $event)">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    asChild?: boolean
}>()

defineEmits<{
    click: [event: MouseEvent]
}>()
</script>
