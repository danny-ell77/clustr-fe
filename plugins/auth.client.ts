import { requiresAuth } from "~/config/routes";

export default defineNuxtPlugin(async () => {
    const { fetchUserAndPermissions, updateAuthState } = useAuth();
    const router = useRouter();

    try {
        const { user, permissions } = await fetchUserAndPermissions();

        if (user) {
            updateAuthState(user, permissions);
        } else {
            const currentPath = router.currentRoute.value.path;

            if (requiresAuth(currentPath)) {
                await router.push('/login');
            }
        }
    } catch (error) {
        console.error('Auth initialization failed:', error);
        const currentPath = router.currentRoute.value.path;

        if (requiresAuth(currentPath)) {
            await router.push('/login');
        }
    }
});
