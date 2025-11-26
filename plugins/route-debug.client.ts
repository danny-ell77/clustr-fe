import { isPublicRoute, isProtectedRoute, isModuleRoute, requiresAuth } from "~/config/routes";

export default defineNuxtPlugin((nuxtApp) => {
    if (process.dev) {
        nuxtApp.hook('page:start', () => {
            const route = useRoute();
            const isPublic = isPublicRoute(route.path);
            const isProtected = isProtectedRoute(route.path);
            const isModule = isModuleRoute(route.path);
            const needsAuth = requiresAuth(route.path);

            console.log('🚦 Route Debug:', {
                path: route.path,
                '🔓 Public': isPublic,
                '🔒 Protected': isProtected,
                '📦 Module': isModule,
                '🔐 Requires Auth': needsAuth,
                '📋 Meta': route.meta
            });
        });
    }
});
