"use client";

import { ref, reactive, computed, readonly } from "vue";
import { useRuntimeConfig } from "#app";
import { $fetch } from "ofetch";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ModuleAccess {
  id: string;
  label: string;
  icon: string;
  order: number;
  permissions: string[];
}

export function useAuth() {
  const config = useRuntimeConfig();
  const user = ref<User | null>(null);
  const permissions = reactive<string[]>([]);
  const isLoading = ref(false);

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
  };

  // Compute available modules based on permissions
  const availableModules = computed(() => {
    const modules = new Map<string, ModuleAccess>();

    permissions.forEach((permission) => {
      if (moduleMap[permission]) {
        modules.set(moduleMap[permission].id, moduleMap[permission]);
      }
    });

    return Array.from(modules.values()).sort((a, b) => a.order - b.order);
  });

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (perms: string[]) => {
    return perms.some((p) => permissions.includes(p));
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch("http://localhost:3000/api/auth/login", {
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
      await $fetch("http://localhost:3000/api/auth/logout", { method: "POST" });
      user.value = null;
      permissions.splice(0, permissions.length);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchUserAndPermissions = async () => {
    isLoading.value = true;
    try {
      const response = await $fetch("http://localhost:3000/api/auth/me");
      user.value = response.user;
      permissions.splice(0, permissions.length, ...response.permissions);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      user.value = null;
      permissions.splice(0, permissions.length);
    } finally {
      isLoading.value = false;
    }
  };

  const shouldShowPrimarySidebar = computed(() => {
    // Show primary sidebar if user is admin or has more than one module available
    return user.value?.role === "Admin" || availableModules.value.length > 1;
  });

  return {
    user: readonly(user),
    permissions: readonly(permissions),
    availableModules,
    isLoading: readonly(isLoading),
    hasPermission,
    hasAnyPermission,
    login,
    logout,
    fetchUserAndPermissions,
    shouldShowPrimarySidebar,
  };
}
