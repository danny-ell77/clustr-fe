import { ref } from 'vue'

const showPermissionModal = ref(false)

export function usePermissionModal() {
    function openPermissionModal() {
        showPermissionModal.value = true
    }
    function closePermissionModal() {
        showPermissionModal.value = false
    }
    return {
        showPermissionModal,
        openPermissionModal,
        closePermissionModal,
    }
} 