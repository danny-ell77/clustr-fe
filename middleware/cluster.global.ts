// Cluster context middleware for multi-tenant vanity URLs
export default defineNuxtRouteMiddleware((to) => {
  const host = useRequestHeaders()["host"] || "";
  const config = useRuntimeConfig();
  const cluster = useState<{ slug: string } | null>(
    "cluster.current",
    () => null
  );

  // Extract subdomain from host
  const mainDomain = (config.public as any)?.mainDomain || "clustr.com";
  const subdomain = extractSubdomain(host, mainDomain);

  if (subdomain && !["www", "api", "cdn"].includes(subdomain)) {
    // This is a cluster subdomain
    cluster.value = { slug: subdomain };

    // Set cluster context for API calls
    useState("cluster.context", () => subdomain);
  } else {
    // Main domain or system subdomain
    cluster.value = null;
    useState("cluster.context", () => null);
  }
});

const extractSubdomain = (host: string, mainDomain: string): string | null => {
  const hostParts = host.split(".");
  const domainParts = mainDomain.split(".");

  if (hostParts.length > domainParts.length) {
    return hostParts[0];
  }

  return null;
};
