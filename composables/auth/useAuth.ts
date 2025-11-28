import { ref, reactive, computed, readonly, watch } from "vue";
import {
    useRuntimeConfig,
    useRequestHeaders,
    useRouter,
    useNuxtApp,
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
    const route = useRoute();
    const nuxtApp = useNuxtApp();
    const $api = nuxtApp.$api as typeof $fetch;

    watch(user, () => {
        error.value = null;
    });

    const isAuthenticated = computed(() => !!user.value);

    const isAdmin = computed(() => {
        return true;
    });
    
    /**
     * Backend now sets HTTP-only cookies automatically
     * Response only contains user and permissions
     * Then we update state with user data
     * @param credentials 
     * @returns 
     */
    const login = async (credentials: LoginCredentials) => {
        try {
            isLoading.value = true;
            error.value = null;
            const response = await $api<{
                user: User;
                permissions: string[];
            }>("/auth/signin/", {
                method: "POST",
                body: credentials,
            });

            user.value = response.user;
            permissions.splice(0, permissions.length, ...response.permissions);

            // Redirect to requested path or home
            const redirectPath = route.query.redirect as string;
            await router.push(redirectPath || "/");

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
            user.value = null;
            permissions.splice(0, permissions.length);

            await clearNuxtState("auth.user");

            // if (nuxtApp.$queryClient) {
            //     nuxtApp.$queryClient.clear();
            // }

            isLoading.value = false;

            await router.push("/login");
        }
    };

    /**
     * Token refresh is handled automatically by the server proxy
     * The server will use the refresh_token cookie
     * If refresh fails, clear auth state.
     * @returns 
     */
    const refreshAuthToken = async () => {
        try {
            const response = await $api<{ access: string }>("/auth/signin/refresh/", {
                method: "POST",
            });

            return response.access;
        } catch (err) {
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
            // Cookies are automatically sent with the request
            const headers = process.server ? useRequestHeaders(["cookie"]) : {};
            const response = await $api<{ user: User; permissions: string[] }>(
                "/accounts/from-auth/",
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
                    }>("/accounts/from-auth/");
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

    /**
     * Run on both server and client
     * Don't initialize if already authenticated
     * Try to fetch user data using HTTP-only cookies
     * Silently fail if not authenticated
     * @returns 
     */
    const initializeAuth = async () => {
        if (user.value) return;

        try {
            isLoading.value = true;
            const { user: fetchedUser, permissions: fetchedPermissions } =
                await fetchUserAndPermissions();
            
            if (fetchedUser) {
                updateAuthState(fetchedUser, fetchedPermissions);
            }
        } catch (err) {
            console.log("No active session found");
        } finally {
            isLoading.value = false;
        }
    };



    return {
        user: readonly(user),
        permissions: readonly(permissions),
        isLoading: readonly(isLoading),
        error: readonly(error),
        isAuthenticated,
        isAdmin,

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
        
        // Expose initialization function in case manual re-init is needed
        initializeAuth,
    };
}
