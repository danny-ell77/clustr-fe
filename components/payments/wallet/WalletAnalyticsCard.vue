<template>
    <div class="flex items-center gap-4 p-6 rounded-lg" :style="{ backgroundColor: bgColor }">
        <div class="w-12 h-12 rounded-full flex items-center justify-center" :style="{ backgroundColor: iconBgColor }">
            <Icon :name="icon" :class="iconColorClass" class="w-6 h-6" />
        </div>
        <div>
            <p class="text-sm opacity-80">{{ title }}</p>
            <p class="text-2xl font-semibold">{{ value }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'

interface Props {
    title: string
    value: string | number
    icon: string
    bgColor?: string
    iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
    bgColor: '#f0f9ff',
    iconColor: 'primary'
})

const iconBgColor = computed(() => {
    if (props.iconColor === 'primary') return 'rgba(59, 130, 246, 0.1)'
    if (props.iconColor === 'success') return 'rgba(16, 185, 129, 0.1)'
    if (props.iconColor === 'warning') return 'rgba(245, 158, 11, 0.1)'
    return 'rgba(0, 0, 0, 0.05)'
})

const iconColorClass = computed(() => {
    if (props.iconColor === 'primary') return 'text-primary'
    if (props.iconColor === 'success') return 'text-green-600'
    if (props.iconColor === 'warning') return 'text-yellow-600'
    return 'text-gray-600'
})
</script>
