import { isPublicRoute, isGuestRoute, requiresAuth, isModuleRoute } from "~/config/routes";
import { APP_MODULES } from "~/config/modules";

export default defineNuxtRouteMiddleware((to) => {
  const { user, isAuthenticated, isAdmin, permissions } = useAuth();
  const { openPermissionModal } = usePermissionModal();

  if (to.meta.auth === false) {
    return;
  }

  if (isPublicRoute(to.path)) {
    if (isGuestRoute(to.path) && isAuthenticated.value) {
      return navigateTo('/');
    }
    return;
  }

  if (!requiresAuth(to.path)) {
    return;
  }

  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }

  if (!user.value) {
    return navigateTo('/login');
  }

  const requiresAdmin = to.meta.requiresAdmin as boolean;
  if (requiresAdmin && !isAdmin.value) {
    openPermissionModal();
    return false;
  }

  const requiredPermission = to.meta.requiresPermission as string;
  if (requiredPermission) {
    const hasPermission = user.value.permissions?.includes(requiredPermission);
    if (!hasPermission && !isAdmin.value) {
      openPermissionModal();
      return false;
    }
  }

  if (isAdmin.value) {
    return;
  }

  if (!isModuleRoute(to.path)) {
    return;
  }

  for (const module of APP_MODULES) {
    if (to.path.startsWith(module.route)) {
      if (!permissions.includes(module.permission)) {
        throw createError({
          statusCode: 403,
          statusMessage: `Access denied to ${module.label} module`,
        });
      }
    }
  }
});
