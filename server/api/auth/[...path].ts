// Auth endpoint forwarding - handles authentication without requiring tokens
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");
  // const method = getMethod(event);
  const body = event.method !== "GET" ? await readBody(event) : undefined;
  const query = getQuery(event);
  const config = useRuntimeConfig();

  const cookies = getRequestHeader(event, "cookie");

  try {
    const response = await $fetch.raw(`${config.public.apiBase}/auth/${path}/`, {
      method: event.method,
      headers: {
        "Content-Type": "application/json",
        ...(cookies ? { Cookie: cookies } : {}),
      },
      body,
      query,
    });

    // Forward Set-Cookie headers from backend to client
    // Use getSetCookie() if available (Node 18+) to handle multiple cookies correctly
    // otherwise fall back to get() which might merge them (less ideal but fallback)
    const setCookieHeaders = (response.headers as any).getSetCookie 
      ? (response.headers as any).getSetCookie() 
      : response.headers.get("set-cookie");
    
    console.log(setCookieHeaders)
      
    if (setCookieHeaders) {
      setResponseHeader(event, "set-cookie", setCookieHeaders);
    }

    return response._data;
  } catch (error: any) {
    // Forward error response
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?.statusText || "Internal Server Error",
      data: error.response?._data,
    });
  }
});
