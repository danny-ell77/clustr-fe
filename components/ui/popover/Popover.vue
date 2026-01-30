<template>
    <div class="relative">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'

const props = defineProps<{
    open?: boolean
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
}>()

const internalOpen = ref(props.open ?? false)

watch(() => props.open, (val) => {
    internalOpen.value = val ?? false
})

const isOpen = computed({
    get: () => internalOpen.value,
    set: (val) => {
        internalOpen.value = val
        emit('update:open', val)
    }
})

const toggle = () => {
    isOpen.value = !isOpen.value
}

const close = () => {
    isOpen.value = false
}

provide('popover', {
    isOpen,
    toggle,
    close
})
</script>
