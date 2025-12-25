// Server utility functions for authentication and token management

export const refreshAccessToken = async (event: any, config: any) => {
  console.log("Refreshing access token");
  const refreshToken = getCookie(event, "refresh_token");
  console.log("Refresh token:", refreshToken ? `${refreshToken.substring(0, 20)}...` : "NONE");

  if (!refreshToken || refreshToken === "undefined") {
    console.log("No refresh token found");
    throw createError({
      statusCode: 401,
      statusMessage: "No refresh token available",
    });
  }

  const refreshUrl = `${config.public.apiBase}/auth/signin/refresh/`;
  console.log("Calling refresh endpoint:", refreshUrl);
  
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

    console.log("Access token updated", response.access_token);

    return response.access_token;


  } catch (error) {
    // If refresh fails, clear both tokens
    // deleteCookie(event, "access_token");
    // deleteCookie(event, "refresh_token");
    console.log(error);
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
