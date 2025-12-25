// Management endpoint forwarding with automatic token refresh
import {
  refreshAccessToken,
  extractSubdomainFromHost,
} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");
  const method = getMethod(event);
  const body = method !== "GET" ? await readBody(event) : undefined;
  const query = getQuery(event);
  const config = useRuntimeConfig();
  let accessToken = getCookie(event, "access_token");
  console.log("Access token", typeof accessToken, accessToken);


  if (!accessToken || accessToken === "undefined") {
    console.log("No access token found");
    try {
      console.log("Refreshing access token");
      accessToken = await refreshAccessToken(event, config);
    } catch (error) {
      console.log("Failed to refresh access token", error);
      throw createError({
        statusCode: 401,
        statusMessage: "Authentication required",
      });
    }
  }

  // Extract cluster context from subdomain
  const host = getHeader(event, "host") || "";
  const mainDomain = (config.public as any)?.mainDomain || "clustr.com";
  const clusterSlug = extractSubdomainFromHost(host, mainDomain);

  const makeRequest = async (token: string) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(clusterSlug && { "X-Cluster-Slug": clusterSlug }),
    };
    const baseUrl = config.public.apiBase || "https://clustr.up.railway.app/api/v1"
    const response = await $fetch.raw(`${baseUrl}/management/${path}`, {
      method,
      headers,
      body,
      query: {
        ...query,
        ...(clusterSlug && { cluster_slug: clusterSlug }),
      },
    });

    // Forward Set-Cookie headers from backend to client
    const setCookieHeaders = (response.headers as any).getSetCookie
      ? (response.headers as any).getSetCookie()
      : response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setResponseHeader(event, "set-cookie", setCookieHeaders);
    }

    return response._data;
  };

  try {
    // First attempt with current token
    return await makeRequest(accessToken);
  } catch (error: any) {
    // $fetch errors have status in different places depending on error type
    const errorStatus = error.response?.status || error.status || error.statusCode;
    
    // If 401 error, try to refresh token and retry
    if (errorStatus === 401) {
      try {
        const newToken = await refreshAccessToken(event, config);
        return await makeRequest(newToken);
      } catch (refreshError) {
        // If refresh also fails, throw the refresh error
        throw refreshError;
      }
    }
    
    // Re-throw with proper error structure
    throw createError({
      statusCode: errorStatus || 500,
      statusMessage: error.statusMessage || error.message || 'Request failed',
      data: error.data,
    });
  }
});
