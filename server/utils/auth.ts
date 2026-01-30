// Server utility functions for authentication and token management

export const refreshAccessToken = async (event: any, config: any) => {
  const refreshToken = getCookie(event, "refresh_token");

  if (!refreshToken || refreshToken === "undefined") {
    console.log("No refresh token found");
    throw createError({
      statusCode: 401,
      statusMessage: "No refresh token available",
    });
  }

  const refreshUrl = `${config.public.apiBase}/auth/signin/refresh/`;
  
  try {
    const response = await $fetch<{ access_token: string }>(
      refreshUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { refresh: refreshToken },
      }
    );

    // Update the access token cookie
    setCookie(event, "access_token", response.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
    });


    return response.access_token;


  } catch (error) {
    // If refresh fails, clear both tokens
    // deleteCookie(event, "access_token");
    // deleteCookie(event, "refresh_token");
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
