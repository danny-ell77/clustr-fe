// Permissions middleware for access control
export default defineNuxtRouteMiddleware((to) => {
  const { user, hasPermission } = useAuth();

  if (!user.value) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  // Module-specific permission checks based on route
  if (to.path.startsWith("/management")) {
    if (!hasPermission("management.view")) {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied to management module",
      });
    }
  }

  if (to.path.startsWith("/accounting")) {
    if (!hasPermission("accounting.overview.view")) {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied to accounting module",
      });
    }
  }

  if (to.path.startsWith("/property")) {
    if (!hasPermission("property.overview.view")) {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied to property module",
      });
    }
  }

  if (to.path.startsWith("/security")) {
    if (!hasPermission("security.overview.view")) {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied to security module",
      });
    }
  }

  if (to.path.startsWith("/shift")) {
    if (!hasPermission("shift.overview.view")) {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied to shift management module",
      });
    }
  }

  if (to.path.startsWith("/portal")) {
    if (!hasPermission("portal.overview.view")) {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied to portal module",
      });
    }
  }
});
