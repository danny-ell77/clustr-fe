<template>
    <Toast v-for="toast in toasts" :key="toast.id" :show="toast.show" :type="toast.type" :title="toast.title"
        :message="toast.message" :duration="0" :anchor-el="toast.anchorEl" @close="removeToast(toast.id)" />
</template>

<script setup>
import { useToast } from '~/composables/useToast'
import Toast from '~/components/ui/toast/Toast.vue'

const { toasts, removeToast } = useToast()
</script>