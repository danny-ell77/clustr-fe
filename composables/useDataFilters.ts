// Focused Data Filters - Build URL queries and trigger table refreshes
// Decouples filter definition, URL building, and data fetching

import { ref, computed, watch, readonly, type Ref } from "vue";

export interface FilterDefinition {
  field: string;
  type: "text" | "select" | "range" | "date" | "boolean";
  label: string;
  options?: Array<{ value: any; label: string }>;
  placeholder?: string;
}

export interface FilterState {
  search: string;
  filters: Record<string, any>;
  sort?: { field: string; order: "asc" | "desc" };
}

export interface FilterOptions {
  // How to persist state
  persistKey?: string;
  // How to build URL query
  buildQuery?: (state: FilterState) => URLSearchParams;
  // Callback when filters change (trigger refresh)
  onFiltersChange?: (query: URLSearchParams) => void;
}

export const useDataFilters = (
  filterDefinitions: FilterDefinition[],
  options: FilterOptions = {}
) => {
  const {
    persistKey,
    buildQuery = defaultQueryBuilder,
    onFiltersChange,
  } = options;

  // Load persisted state
  const loadState = (): FilterState => {
    if (!persistKey || typeof window === "undefined") {
      return { search: "", filters: {} };
    }

    try {
      const saved = localStorage.getItem(persistKey);
      return saved ? JSON.parse(saved) : { search: "", filters: {} };
    } catch {
      return { search: "", filters: {} };
    }
  };

  // State
  const state = ref<FilterState>(loadState());

  // Build URL query from current state
  const currentQuery = computed(() => buildQuery(state.value));

  // Check if any filters are active
  const hasActiveFilters = computed(
    () =>
      state.value.search ||
      Object.keys(state.value.filters).length > 0 ||
      state.value.sort
  );

  // Actions
  const setSearch = (query: string) => {
    state.value.search = query;
  };

  const setFilter = (field: string, value: any) => {
    if (value === null || value === undefined || value === "") {
      delete state.value.filters[field];
    } else {
      state.value.filters[field] = value;
    }
  };

  const setSort = (field: string, order: "asc" | "desc" = "asc") => {
    state.value.sort = { field, order };
  };

  const toggleSort = (field: string) => {
    if (state.value.sort?.field === field) {
      state.value.sort.order =
        state.value.sort.order === "asc" ? "desc" : "asc";
    } else {
      state.value.sort = { field, order: "asc" };
    }
  };

  const clearFilters = () => {
    state.value.search = "";
    state.value.filters = {};
    state.value.sort = undefined;
  };

  // Persist state changes
  watch(
    state,
    (newState) => {
      // Persist to localStorage
      if (persistKey && typeof window !== "undefined") {
        localStorage.setItem(persistKey, JSON.stringify(newState));
      }

      // Trigger refresh callback
      if (onFiltersChange) {
        onFiltersChange(currentQuery.value);
      }
    },
    { deep: true }
  );

  return {
    // State
    state: readonly(state),
    currentQuery,
    hasActiveFilters,

    // Filter definitions
    filterDefinitions,

    // Actions
    setSearch,
    setFilter,
    setSort,
    toggleSort,
    clearFilters,
  };
};

// Default query builder
function defaultQueryBuilder(state: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.search) {
    params.set("search", state.search);
  }

  Object.entries(state.filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  if (state.sort) {
    params.set("sort", state.sort.field);
    params.set("order", state.sort.order);
  }

  return params;
}

// Helper: Apply filters to client-side data
export const applyFiltersToData = <T>(
  data: T[],
  state: FilterState,
  searchFields: (keyof T)[] = []
): T[] => {
  let result = data;

  // Apply search
  if (state.search && searchFields.length > 0) {
    const query = state.search.toLowerCase();
    result = result.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(query);
      })
    );
  }

  // Apply filters
  Object.entries(state.filters).forEach(([field, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      result = result.filter((item) => (item as any)[field] === value);
    }
  });

  // Apply sort
  if (state.sort) {
    const { field, order } = state.sort;
    result = [...result].sort((a, b) => {
      const aVal = (a as any)[field];
      const bVal = (b as any)[field];

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  return result;
};
