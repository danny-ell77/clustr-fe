<template>
    <div class="fixed top-4 right-4 z-50 space-y-2">
        <Toast v-for="toast in toasts" :key="toast.id" :show="toast.show" :type="toast.type" :title="toast.title"
            :message="toast.message" :duration="0" @close="removeToast(toast.id)" />
    </div>
</template>

<script setup>
import { useToast } from '~/composables/useToast'
import Toast from '~/components/ui/toast/Toast.vue'

const { toasts, removeToast } = useToast()
</script>