<template>
    <div class="relative">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    open?: boolean
}>()

defineEmits<{
    'update:open': [value: boolean]
}>()
</script>
