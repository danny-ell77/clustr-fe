<template>
    <SuccessModal :show="isVisible" :title="modalData.title" :message="modalData.message" :ok-text="modalData.okText"
        @close="hideSuccess" />
</template>

<script setup>
import { useSuccessModal } from '~/composables/useSuccessModal'
import SuccessModal from '~/components/ui/modal/SuccessModal.vue'

const { isVisible, modalData, hideSuccess } = useSuccessModal()
</script>