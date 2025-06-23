import { ref, reactive, computed, readonly } from "vue";
import { useRuntimeConfig, useRequestHeaders } from "nuxt/app";
import { $fetch } from "ofetch";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const user = ref<User | null>(null);
const permissions = reactive<string[]>([]);
const isLoading = ref(false);


export function useAuth() {
  const config = useRuntimeConfig();

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (perms: string[]) => {
    return perms.some((p) => permissions.includes(p));
  };

  const isAdmin = computed(() => {
    return user.value?.role === "Admin";
  });

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    console.log("Login attempt for:", email, password);
    try {
      const response = await $fetch(`${config.public.apiBase}/auth/login`, {
        method: "POST",
        body: { email, password },
      });

      user.value = response.user;
      permissions.splice(0, permissions.length, ...response.permissions);

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: "Login failed" };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await $fetch(`${config.public.apiBase}/auth/logout`, { method: "POST" });
      user.value = null;
      permissions.splice(0, permissions.length);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchUserAndPermissions = async () => {
    isLoading.value = true;
    try {
      const headers = process.server ? useRequestHeaders(['cookie']) : {}
      const response = await $fetch(`${config.public.apiBase}/auth/me`, {
        headers: { ...headers }
      });
      return { user: response.user, permissions: response.permissions };
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return { user: null, permissions: [] };
    } finally {
      isLoading.value = false;
    }
  };

  const updateAuthState = (
    fetchedUser: User | null,
    fetchedPermissions: string[]
  ) => {
    user.value = fetchedUser;
    permissions.splice(0, permissions.length, ...fetchedPermissions);
  };

  // Module metadata
  const allModules = [
    { id: 'property', label: 'Properties', icon: 'home', permission: 'property.overview.view' },
    { id: 'accounting', label: 'Accounting', icon: 'dollar-sign', permission: 'accounting.overview.view' },
    { id: 'security', label: 'Security', icon: 'shield', permission: 'security.overview.view' },
    { id: 'shift', label: 'Shift Management', icon: 'calendar-clock', permission: 'shift.overview.view' },
    { id: 'portal', label: 'Portal', icon: 'message-circle', permission: 'portal.overview.view' },
  ]

  // Compute available modules based on permissions or admin
  const availableModules = computed(() => {
    if (isAdmin.value) return allModules
    return allModules.filter(m => permissions.includes(m.permission))
  })

  return {
    user: readonly(user),
    permissions: readonly(permissions),
    isLoading: readonly(isLoading),
    isAdmin,
    hasPermission,
    hasAnyPermission,
    login,
    logout,
    fetchUserAndPermissions,
    updateAuthState,
    availableModules,
  };
}
