import { routeConfig, isPublicRoute, isProtectedRoute, isModuleRoute } from '~/config/routes';

export const useRoutes = () => {
    const router = useRouter();
    const route = useRoute();

    const isPublic = computed(() => isPublicRoute(route.path));
    const isProtected = computed(() => isProtectedRoute(route.path) || isModuleRoute(route.path));
    const isModule = computed(() => isModuleRoute(route.path));

    const goToProtected = (key: keyof typeof routeConfig.protected) => {
        return navigateTo(routeConfig.protected[key]);
    };

    const goToModule = (module: typeof routeConfig.modules[number]) => {
        return navigateTo(module);
    };

    return {
        isPublic,
        isProtected,
        isModule,
        goToProtected,
        goToModule,
        routes: routeConfig,
    };
};
