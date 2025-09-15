// Auth middleware for route protection
export default defineNuxtRouteMiddleware((to) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }
});
