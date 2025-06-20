"use client"

import { ref, reactive, computed, readonly } from "vue"
import { useRuntimeConfig } from "#app"
import { $fetch } from "ofetch"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface ModuleAccess {
  id: string
  label: string
  icon: string
  order: number
  permissions: string[]
}

export function useAuth() {
  const config = useRuntimeConfig()
  const user = ref<User | null>(null)
  const permissions = reactive<string[]>([])
  const isLoading = ref(false)

  // Define module access mapping
  const moduleMap: Record<string, ModuleAccess> = {
    "property.view": {
      id: "property",
      label: "Properties",
      icon: "home",
      order: 1,
      permissions: ["property.view"],
    },
    "accounting.view": {
      id: "accounting",
      label: "Accounting",
      icon: "dollar-sign",
      order: 2,
      permissions: ["accounting.view"],
    },
    "security.view": {
      id: "security",
      label: "Access Control",
      icon: "shield",
      order: 3,
      permissions: ["security.view"],
    },
    "shift.view": {
      id: "shift",
      label: "Shift Management",
      icon: "calendar-clock",
      order: 4,
      permissions: ["shift.view"],
    },
    "portal.view": {
      id: "portal",
      label: "Tenant Portal",
      icon: "message-circle",
      order: 5,
      permissions: ["portal.view"],
    },
  }

  // Compute available modules based on permissions
  const availableModules = computed(() => {
    const modules = new Map<string, ModuleAccess>()

    permissions.forEach((permission) => {
      if (moduleMap[permission]) {
        modules.set(moduleMap[permission].id, moduleMap[permission])
      }
    })

    return Array.from(modules.values()).sort((a, b) => a.order - b.order)
  })

  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  const hasAnyPermission = (perms: string[]) => {
    return perms.some((p) => permissions.includes(p))
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await $fetch(`${config.public.apiBase}/auth/login`, {
        method: "POST",
        body: { email, password },
      })

      user.value = response.user
      permissions.splice(0, permissions.length, ...response.permissions)

      return { success: true }
    } catch (error) {
      console.error("Login failed:", error)
      return { success: false, error: "Login failed" }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await $fetch(`${config.public.apiBase}/auth/logout`, { method: "POST" })
      user.value = null
      permissions.splice(0, permissions.length)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Modified to throw error on failure, allowing useAsyncData to handle it
  const fetchUserAndPermissions = async () => {
    isLoading.value = true
    try {
      const response = await $fetch(`${config.public.apiBase}/auth/me`)
      return { user: response.user, permissions: response.permissions }
    } catch (error) {
      // Re-throw the error so useAsyncData's onError can catch it
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Function to update internal state from fetched data
  const updateAuthState = (fetchedUser: User | null, fetchedPermissions: string[]) => {
    user.value = fetchedUser
    permissions.splice(0, permissions.length, ...fetchedPermissions)
  }

  const shouldShowPrimarySidebar = computed(() => {
    // Show primary sidebar if user is admin or has more than one module available
    return user.value?.role === "Admin" || availableModules.value.length > 1
  })

  return {
    user: readonly(user),
    permissions: readonly(permissions),
    availableModules,
    isLoading: readonly(isLoading),
    hasPermission,
    hasAnyPermission,
    login,
    logout,
    fetchUserAndPermissions, // Still exposed for direct calls if needed
    updateAuthState, // New function to update state
    shouldShowPrimarySidebar,
  }
}
