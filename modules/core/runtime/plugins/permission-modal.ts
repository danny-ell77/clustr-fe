import { defineNuxtPlugin } from 'nuxt/app'
import { usePermissionModal } from '../composables/usePermissionModal'

export default defineNuxtPlugin(() => {
    // This ensures the composable is initialized on app start
    usePermissionModal()
})
