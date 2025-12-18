// Server utility functions for authentication and token management

export const refreshAccessToken = async (event: any, config: any) => {
  console.log("Refreshing access token");
  const refreshToken = getCookie(event, "refresh_token");

  if (!refreshToken) {
    console.log("No refresh tokken found");
    throw createError({
      statusCode: 401,
      statusMessage: "No refresh token available",
    });
  }

  try {
    const response = await $fetch<{ access: string }>(
      `${config.backendUrl}/auth/signin/refresh/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { refresh: refreshToken },
      }
    );

    // Update the access token cookie
    setCookie(event, "access_token", response.access, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
    });

    return response.access;
  } catch (error) {
    // If refresh fails, clear both tokens
    // deleteCookie(event, "access_token");
    // deleteCookie(event, "refresh_token");
    console.log("Session expired. Please log in again.", error);
    throw createError({
      statusCode: 401,
      statusMessage: "Session expired. Please log in again.",
    });
  }
};

export const extractSubdomainFromHost = (
  host: string,
  mainDomain: string
): string | null => {
  const hostParts = host.split(".");
  const domainParts = mainDomain.split(".");

  if (hostParts.length > domainParts.length) {
    return hostParts[0];
  }

  return null;
};
