import { useAuth } from "../composables/useAuth"
import { defineNuxtPlugin } from "nuxt/app"

export default defineNuxtPlugin({
  name: "auth",
  setup() {
    const {
      user,
      permissions,
      isLoading,
      login,
      logout,
      hasPermission,
      hasAnyPermission,
      fetchUserAndPermissions,
      updateAuthState,
    } = useAuth()

    fetchUserAndPermissions().then(({ user, permissions }) => {
      updateAuthState(user, permissions);
    });

    return {
      provide: {
        user,
        permissions,
        isLoading,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
        fetchUserAndPermissions,
      },
    }
  },
})
