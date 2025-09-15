// Core Auth Composable - JWT-based Architecture
// Handles JWT token management, authentication state, and cookie-based security

import { ref, reactive, computed, readonly } from "vue";
import { useRuntimeConfig, useRequestHeaders, useRouter } from "nuxt/app";
import { $fetch } from "ofetch";
import type {
  User,
  LoginCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PasswordChangeRequest,
} from "~/types/auth";

// State management with JWT-based architecture
const user = ref<User | null>(null);
const permissions = reactive<string[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// JWT Token management with httpOnly cookies
const accessToken = useCookie("access_token", {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 60 * 15, // 15 minutes
});
const refreshToken = useCookie("refresh_token", {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 60 * 60 * 24 * 7, // 7 days
});

export function useAuth() {
  const config = useRuntimeConfig();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  const $api = nuxtApp.$api as typeof $fetch;

  // Clear error when user changes
  watch(user, () => {
    error.value = null;
  });

  // Computed properties
  const isAuthenticated = computed(() => !!user.value);

  const isAdmin = computed(() => {
    return (
      user.value?.roles?.includes("Admin") ||
      user.value?.roles?.includes("admin")
    );
  });

  // Permission checks
  const hasPermission = (permission: string) => {
    console.log("Checking permission for:", permission);
    console.log("Current permissions:", permissions);
    return permissions.includes(permission) || isAdmin.value;
  };

  const hasAnyPermission = (perms: string[]) => {
    return perms.some((p) => permissions.includes(p)) || isAdmin.value;
  };

  // JWT Authentication with proper error handling
  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $api<{
        access: string;
        refresh: string;
        user: User;
        permissions: string[];
      }>("/auth/signin/", {
        method: "POST",
        body: credentials,
      });

      // Set tokens in httpOnly cookies
      accessToken.value = response.access;
      refreshToken.value = response.refresh;

      // Set user state
      user.value = response.user;
      permissions.splice(0, permissions.length, ...response.permissions);

      return { success: true };
    } catch (err: any) {
      error.value = err.data?.message || "Login failed";
      console.error("Login failed:", err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      isLoading.value = true;

      // Call logout endpoint to invalidate tokens
      await $api("/auth/signout/", {
        method: "POST",
      });
    } catch (err) {
      // Continue with logout even if server call fails
      console.error("Logout error:", err);
    } finally {
      // Clear local state and cookies
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;
      permissions.splice(0, permissions.length);

      // Clear user state
      await clearNuxtState("auth.user");

      isLoading.value = false;

      // Redirect to login page
      await router.push("/login");
    }
  };

  const refreshAuthToken = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error("No refresh token available");
      }

      const response = await $api<{ access: string }>("/auth/signin/refresh/", {
        method: "POST",
        body: { refresh: refreshToken.value },
      });

      accessToken.value = response.access;
      return response.access;
    } catch (err) {
      // If refresh fails, clear tokens and redirect to login
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;
      permissions.splice(0, permissions.length);
      await clearNuxtState("auth.user");
      await router.push("/login");
      throw err;
    }
  };

  const fetchUserAndPermissions = async () => {
    isLoading.value = true;
    try {
      if (!accessToken.value) {
        return { user: null, permissions: [] };
      }

      const headers = process.server ? useRequestHeaders(["cookie"]) : {};
      const response = await $api<{ user: User; permissions: string[] }>(
        "/auth/me/",
        {
          headers: { ...headers },
        }
      );

      return { user: response.user, permissions: response.permissions };
    } catch (error: any) {
      console.error("Failed to fetch user data:", error);
      if (error?.response?.status === 401 && process.client) {
        // Token invalid, try to refresh
        try {
          await refreshAuthToken();
          // Retry the request
          const retryResponse = await $api<{
            user: User;
            permissions: string[];
          }>("/auth/me/");
          return {
            user: retryResponse.user,
            permissions: retryResponse.permissions,
          };
        } catch (refreshError) {
          // Refresh failed, redirect to login
          router.push("/login");
          return { user: null, permissions: [] };
        }
      }
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

  // Additional auth methods from architecture
  const forgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $api("/auth/forgot-password/", {
        method: "POST",
        body: data,
      });

      return response;
    } catch (err: any) {
      error.value = err.data?.message || "Failed to send reset email";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $api("/auth/reset-password/", {
        method: "POST",
        body: data,
      });

      return response;
    } catch (err: any) {
      error.value = err.data?.message || "Failed to reset password";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const changePassword = async (data: PasswordChangeRequest) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $api("/auth/change-password/", {
        method: "POST",
        body: data,
      });

      return response;
    } catch (err: any) {
      error.value = err.data?.message || "Failed to change password";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const verifyEmail = async (verificationKey: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $api("/auth/verify-email/", {
        method: "POST",
        body: { verificationKey },
      });

      // Update user verification status
      if (user.value) {
        user.value.isVerified = true;
      }

      return response;
    } catch (err: any) {
      error.value = err.data?.message || "Email verification failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Module metadata for management app
  const allModules = [
    {
      id: "property",
      label: "Properties",
      icon: "home",
      permission: "property.overview.view",
    },
    {
      id: "accounting",
      label: "Accounting",
      icon: "dollar-sign",
      permission: "accounting.overview.view",
    },
    {
      id: "security",
      label: "Access Control",
      icon: "key",
      permission: "security.overview.view",
    },
    {
      id: "shift",
      label: "Shift Management",
      icon: "calendar-clock",
      permission: "shift.overview.view",
    },
    {
      id: "portal",
      label: "Portal",
      icon: "message-circle",
      permission: "portal.overview.view",
    },
  ];

  // Compute available modules based on permissions or admin
  const availableModules = computed(() => {
    if (isAdmin.value) return allModules;
    return allModules.filter((m) => permissions.includes(m.permission));
  });

  return {
    // State
    user: readonly(user),
    permissions: readonly(permissions),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,
    isAdmin,
    accessToken: readonly(accessToken),

    // Permission checks
    hasPermission,
    hasAnyPermission,

    // Auth actions
    login,
    logout,
    refreshAuthToken,
    fetchUserAndPermissions,
    updateAuthState,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,

    // Module management
    availableModules,
  };
}
