import { useAuth } from '~/modules/core/runtime/composables/useAuth'
import { usePermissionModal } from '~/modules/core/runtime/composables/usePermissionModal'

export default defineNuxtRouteMiddleware((to) => {
    const { user, hasPermission } = useAuth()
    const { openPermissionModal } = usePermissionModal()

    // Skip middleware if no user (will be handled by login page)
    if (!user.value) {
        return
    }

    // Check if route requires specific permissions
  const requiredPermission = to.meta.requiresPermission as string
  if (requiredPermission && !hasPermission(requiredPermission)) {
      openPermissionModal()
      return false // Cancel navigation
  }

  // Check if route requires admin role
  const requiresAdmin = to.meta.requiresAdmin as boolean
  if (requiresAdmin && user.value && user.value.role !== 'Admin') {
      openPermissionModal()
      return false // Cancel navigation
  }
})
