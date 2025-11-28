export const routeConfig = {
    public: [
        '/',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/onboarding',
        '/error',
        '/no-permissions',
        '/font-test',
    ] as const,

    guest: [
        '/login',
        '/register',
        '/onboarding',
    ] as const,

    protected: {
        settings: '/settings',
    } as const,

    modules: [
        '/property',
        '/payments',
        '/security',
        '/shift',
        '/portal',
    ] as const,
} as const;

export const isPublicRoute = (path: string): boolean => {
    return routeConfig.public.some(route => {
        return path === route || path.startsWith(`${route}/`);
    });
};

export const isGuestRoute = (path: string): boolean => {
    return routeConfig.guest.some(route => {
        return path === route || path.startsWith(`${route}/`);
    });
};

export const isModuleRoute = (path: string): boolean => {
    return routeConfig.modules.some(module => {
        return path.startsWith(module);
    });
};

export const isProtectedRoute = (path: string): boolean => {
    return Object.values(routeConfig.protected).some(route => {
        return path === route || path.startsWith(`${route}/`);
    });
};

export const requiresAuth = (path: string): boolean => {
    return isModuleRoute(path) || isProtectedRoute(path);
};
