// Universal Pagination Composable
// Handles both traditional pagination and infinite scroll scenarios

interface PaginationOptions {
  pageSize?: number;
  initialFilters?: Record<string, any>;
  infiniteScroll?: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const usePagination = <T>(
  fetchFn: (params: any) => Promise<PaginatedResponse<T>>,
  options: PaginationOptions = {}
) => {
  const items = ref<T[]>([]);
  const loading = ref(false);
  const hasNextPage = ref(true);
  const currentPage = ref(1);
  const totalCount = ref(0);
  const filters = ref(options.initialFilters || {});
  const error = ref<string | null>(null);

  const pageSize = options.pageSize || 20;
  const infiniteScroll = options.infiniteScroll || false;

  const loadPage = async (page: number = 1, reset: boolean = false) => {
    if (loading.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await fetchFn({
        page,
        pageSize,
        ...filters.value,
      });

      if (reset || page === 1) {
        items.value = response.results;
      } else {
        items.value.push(...response.results);
      }

      hasNextPage.value = !!response.next;
      currentPage.value = page;
      totalCount.value = response.count;
    } catch (err: any) {
      error.value = err.message || "Failed to load data";
      console.error("Pagination error:", err);
    } finally {
      loading.value = false;
    }
  };

  const loadMore = () => {
    if (hasNextPage.value && !loading.value) {
      loadPage(currentPage.value + 1);
    }
  };

  const refresh = () => loadPage(1, true);

  const applyFilters = (newFilters: any) => {
    filters.value = { ...filters.value, ...newFilters };
    refresh();
  };

  const clearFilters = () => {
    filters.value = options.initialFilters || {};
    refresh();
  };

  const goToPage = (page: number) => {
    if (!infiniteScroll && page >= 1) {
      loadPage(page, true);
    }
  };

  // Computed properties
  const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));
  const hasItems = computed(() => items.value.length > 0);
  const isEmpty = computed(() => !loading.value && !hasItems.value);

  // Auto-load first page
  onMounted(() => {
    loadPage(1);
  });

  return {
    // Data
    items: readonly(items),
    loading: readonly(loading),
    error: readonly(error),
    hasNextPage: readonly(hasNextPage),
    currentPage: readonly(currentPage),
    totalCount: readonly(totalCount),
    totalPages,
    hasItems,
    isEmpty,
    filters: readonly(filters),

    // Actions
    loadMore,
    refresh,
    applyFilters,
    clearFilters,
    goToPage,
    loadPage,
  };
};
