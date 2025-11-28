<template>
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
        <div v-if="show" class="fixed z-[9999] max-w-sm w-full pointer-events-auto" :style="position">
            <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start gap-3">
                <div class="flex-shrink-0">
                    <Icon :name="iconName" class="w-5 h-5" :class="iconColor" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ title }}</p>
                    <p v-if="message" class="text-sm text-gray-500 mt-1">{{ message }}</p>
                </div>
                <button @click="close" class="flex-shrink-0 text-gray-400 hover:text-gray-600">
                    <Icon name="x" class="w-4 h-4" />
                </button>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Icon from '~/components/Icon.vue'
import { calculateToastPosition } from '~/composables/useToast'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'success',
        validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    duration: {
        type: Number,
        default: 5000
    },
    anchorEl: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close'])

const position = computed(() => calculateToastPosition(props.anchorEl))

const iconName = computed(() => {
    switch (props.type) {
        case 'success': return 'check-circle'
        case 'error': return 'x-circle'
        case 'warning': return 'alert-triangle'
        case 'info': return 'info'
        default: return 'check-circle'
    }
})

const iconColor = computed(() => {
    switch (props.type) {
        case 'success': return 'text-green-500'
        case 'error': return 'text-red-500'
        case 'warning': return 'text-yellow-500'
        case 'info': return 'text-primary'
        default: return 'text-green-500'
    }
})

const close = () => {
    emit('close')
}

onMounted(() => {
    if (props.duration > 0) {
        setTimeout(() => {
            close()
        }, props.duration)
    }
})
</script>