import { camelCase, snakeCase } from "lodash";

const transformKeys = (obj: any, transformer: Function): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item, transformer));
  }

  if (obj && typeof obj === "object" && obj.constructor === Object) {
    const transformed = {};
    for (const [key, value] of Object.entries(obj)) {
      transformed[transformer(key)] = transformKeys(value, transformer);
    }
    return transformed;
  }

  return obj;
};

export default defineNuxtPlugin(() => {
  // Create a custom $api instance with automatic case conversion
  const api = $fetch.create({
    baseURL: "/api",
    onRequest({ options }) {
      if (options.body && typeof options.body === "object") {
        options.body = transformKeys(options.body, snakeCase);
      }
      if (options.query && typeof options.query === "object") {
        options.query = transformKeys(options.query, snakeCase);
      }
    },
    onResponse({ response }) {
      if (response._data && typeof response._data === "object") {
        response._data = transformKeys(response._data, camelCase);
      }
    },
    onResponseError({ response }) {
      if (response._data && typeof response._data === "object") {
        response._data = transformKeys(response._data, camelCase);
      }
      
      // Redirect to login on 401 errors (authentication failed)
      if (response.status === 401) {
        const currentPath = window.location.pathname;
        // Don't redirect if already on login page
        if (!currentPath.startsWith('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    },
  });

  return {
    provide: {
      api, // Available as $api in composables and components
    },
  };
});
