// Accounts endpoint forwarding with automatic token refresh
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

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
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

    const response = await $fetch.raw(`${baseUrl}/accounts/${path}`, {
      method,
      headers,
      body,
      query: {
        ...query,
        ...(clusterSlug && { cluster_slug: clusterSlug }),
      },
    });

    const setCookieHeaders = (response.headers as any).getSetCookie 
      ? (response.headers as any).getSetCookie() 
      : response.headers.get("set-cookie");
    
    console.log(setCookieHeaders)
      
    if (setCookieHeaders) {
      setResponseHeader(event, "set-cookie", setCookieHeaders);
    }

    return response._data;
  };

  try {
    // First attempt with current token
    return await makeRequest(accessToken);
  } catch (error: any) {
    // If 401 error, try to refresh token and retry
    if (error.statusCode === 401) {
      const newToken = await refreshAccessToken(event, config);
      return await makeRequest(newToken);
    }
    throw error;
  }
});
