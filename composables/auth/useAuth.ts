import { ref, reactive, computed, readonly, watch } from "vue";
import {
    useRuntimeConfig,
    useRequestHeaders,
    useRouter,
    useNuxtApp,
    useCookie,
    clearNuxtState,
} from "nuxt/app";
import { $fetch } from "ofetch";
import type {
    User,
    LoginCredentials,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    PasswordChangeRequest,
} from "~/types/auth";
import { APP_MODULES } from "~/config/modules";

const user = ref<User | null>(null);
const permissions = reactive<string[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useAuth() {
    const config = useRuntimeConfig();
    const router = useRouter();
    const nuxtApp = useNuxtApp();
    const $api = nuxtApp.$api as typeof $fetch;

    const accessToken = useCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 15,
    });
    const refreshToken = useCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
    });

    watch(user, () => {
        error.value = null;
    });

    const isAuthenticated = computed(() => !!user.value);

    const isAdmin = computed(() => {
        return true;
    });

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

            accessToken.value = response.access;
            refreshToken.value = response.refresh;

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

            await $api("/auth/signout/", {
                method: "POST",
            });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            accessToken.value = null;
            refreshToken.value = null;
            user.value = null;
            permissions.splice(0, permissions.length);

            await clearNuxtState("auth.user");

            if (nuxtApp.$queryClient) {
                nuxtApp.$queryClient.clear();
            }

            isLoading.value = false;

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
                try {
                    await refreshAuthToken();
                    const retryResponse = await $api<{
                        user: User;
                        permissions: string[];
                    }>("/auth/me/");
                    return {
                        user: retryResponse.user,
                        permissions: retryResponse.permissions,
                    };
                } catch (refreshError) {
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

    const availableModules = computed(() => {
        if (isAdmin.value) return APP_MODULES;
        return APP_MODULES.filter((m) => permissions.includes(m.permission));
    });

    const hasPermission = (permission: string): boolean => {
        if (isAdmin.value) return true;
        return permissions.includes(permission);
    };

    const hasAnyPermission = (permissionList: string[]): boolean => {
        if (isAdmin.value) return true;
        return permissionList.some((p) => permissions.includes(p));
    };

    const hasAllPermissions = (permissionList: string[]): boolean => {
        if (isAdmin.value) return true;
        return permissionList.every((p) => permissions.includes(p));
    };

    return {
        user: readonly(user),
        permissions: readonly(permissions),
        isLoading: readonly(isLoading),
        error: readonly(error),
        isAuthenticated,
        isAdmin,
        accessToken: readonly(accessToken),

        login,
        logout,
        refreshAuthToken,
        fetchUserAndPermissions,
        updateAuthState,
        forgotPassword,
        resetPassword,
        changePassword,
        verifyEmail,

        hasPermission,
        hasAnyPermission,
        hasAllPermissions,

        availableModules,
    };
}
