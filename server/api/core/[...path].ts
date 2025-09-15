// Core utilities endpoint forwarding with optional auth
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

  // Extract cluster context from subdomain
  const host = getHeader(event, "host") || "";
  const mainDomain = (config.public as any)?.mainDomain || "clustr.com";
  const clusterSlug = extractSubdomainFromHost(host, mainDomain);

  const makeRequest = async (token?: string) => {
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
      ...(clusterSlug && { "X-Cluster-Slug": clusterSlug }),
    };

    return await $fetch(`${config.backendUrl}/core/${path}`, {
      method,
      headers,
      body,
      query: {
        ...query,
        ...(clusterSlug && { cluster_slug: clusterSlug }),
      },
    });
  };

  if (!accessToken) {
    // For core endpoints, some may not require auth
    return await makeRequest();
  }

  try {
    // First attempt with current token
    return await makeRequest(accessToken);
  } catch (error: any) {
    // If 401 error, try to refresh token and retry
    if (error.statusCode === 401) {
      try {
        const newToken = await refreshAccessToken(event, config);
        return await makeRequest(newToken);
      } catch (refreshError) {
        // If refresh fails, try without auth (for public endpoints)
        return await makeRequest();
      }
    }
    throw error;
  }
});
