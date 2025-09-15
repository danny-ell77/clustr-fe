// Simple API utilities - focused on what we actually need
// Wraps Nuxt's useLazyAsyncData with consistent error handling

export interface ApiOptions {
  transform?: (data: any) => any;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
}

// Simple wrapper around useLazyAsyncData for consistent API calls
export const useApiData = <T = any>(
  key: string,
  fetcher: () => Promise<T>,
  options: ApiOptions = {}
) => {
  const { transform = (data: any) => data, onError, onSuccess } = options;

  return useLazyAsyncData(key, async () => {
    try {
      const data = await fetcher();
      const transformed = transform(data);
      onSuccess?.(transformed);
      return transformed;
    } catch (error) {
      onError?.(error);
      throw error;
    }
  });
};

// Simple cache invalidation helper
export const invalidateApiCache = (pattern: string) => {
  // Use Nuxt's built-in cache clearing
  clearNuxtData(pattern);
};
