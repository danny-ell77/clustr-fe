// Public endpoint forwarding for sharing features
import { extractSubdomainFromHost } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");
  const method = getMethod(event);
  const query = getQuery(event);
  const config = useRuntimeConfig();

  // Extract cluster context from subdomain
  const host = getHeader(event, "host") || "";
  const mainDomain = (config.public as any)?.mainDomain || "clustr.com";
  const clusterSlug = extractSubdomainFromHost(host, mainDomain);

  const headers = {
    "Content-Type": "application/json",
    ...(clusterSlug && { "X-Cluster-Slug": clusterSlug }),
  };

  return await $fetch(`${config.backendUrl}/public/${path}`, {
    method,
    headers,
    query: {
      ...query,
      ...(clusterSlug && { cluster_slug: clusterSlug }),
    },
  });
});
