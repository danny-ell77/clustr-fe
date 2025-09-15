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

    return await $fetch(`${config.backendUrl}/management/${path}`, {
      method,
      headers,
      body,
      query: {
        ...query,
        ...(clusterSlug && { cluster_slug: clusterSlug }),
      },
    });
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
