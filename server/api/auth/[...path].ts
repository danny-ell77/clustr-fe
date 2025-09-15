// Auth endpoint forwarding - handles authentication without requiring tokens
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");
  const method = getMethod(event);
  const body = method !== "GET" ? await readBody(event) : undefined;
  const query = getQuery(event);
  const config = useRuntimeConfig();

  return await $fetch(`${config.backendUrl}/auth/${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body,
    query,
  });
});
