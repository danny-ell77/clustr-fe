# Saved Views System - Research & Implementation Plan

## Executive Summary

This document outlines the architecture and implementation strategy for a modern, minimalist Saved Views system for complex dashboard tables in Vue 3 (Composition API). The system enables users to create, persist, and manage custom filter configurations with URL synchronization and localStorage persistence.

---

## 1. System Architecture Overview

### 1.1 Core Components

```
┌─────────────────────────────────────────────────────────┐
│                    MainTablePage.vue                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │              TabsBar.vue                          │  │
│  │  [ All ] [ Pending ] [ High Value ] [+]          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              DataTable.vue                        │  │
│  │  (Filtered data based on active view)            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │ useDataFilters()    │
              │  Composable Hook    │
              └─────────────────────┘
                    │         │
        ┌───────────┘         └───────────┐
        ▼                                 ▼
┌──────────────┐                  ┌──────────────┐
│ LocalStorage │                  │  URL Params  │
│   Persistence│                  │     Sync     │
└──────────────┘                  └──────────────┘
```

### 1.2 Data Flow

1. **User Interaction** → TabsBar or CreateViewModal
2. **State Update** → useDataFilters() composable
3. **Persistence** → LocalStorage + URL params
4. **Table Refresh** → Reactive filters trigger data refetch

---

## 2. Technical Specifications

### 2.1 Data Structures

#### SavedView Interface
```typescript
interface SavedView {
  id: string;                    // UUID v4
  name: string;                  // Display name
  filters: Record<string, any>;  // Filter configuration
  persisted: boolean;            // Whether to show as tab
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
}
```

#### FilterState Interface
```typescript
interface FilterState {
  // Example filters - customize per table
  status?: string[];
  dateRange?: { start: Date; end: Date };
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
  category?: string;
  // ... extensible
}
```

### 2.2 LocalStorage Schema

```typescript
// Key: 'saved_views_{tableId}'
{
  views: SavedView[],
  activeViewId: string | null,
  lastUpdated: number
}
```

### 2.3 URL Parameter Mapping

```typescript
// Example URL: /orders?status=pending,shipped&min_amount=5000&view=abc123

const urlParamMapping = {
  'status': 'status',           // Array → comma-separated
  'min_amount': 'minAmount',    // Number
  'max_amount': 'maxAmount',    // Number
  'search': 'searchQuery',      // String
  'date_from': 'dateRange.start', // Date
  'date_to': 'dateRange.end',   // Date
  'view': 'activeViewId'        // View ID
};
```

---

## 3. Implementation Strategy

### 3.1 Phase 1: Core Composable (useDataFilters)

**Priority: HIGH**

#### Responsibilities
- Manage reactive filter state
- CRUD operations for saved views
- LocalStorage persistence
- URL synchronization
- Active view management

#### Key Functions
```typescript
export function useDataFilters(tableId: string) {
  // State
  const filters = ref<FilterState>({});
  const savedViews = ref<SavedView[]>([]);
  const activeViewId = ref<string | null>(null);
  
  // Computed
  const activeView = computed(() => 
    savedViews.value.find(v => v.id === activeViewId.value)
  );
  
  const persistedViews = computed(() =>
    savedViews.value.filter(v => v.persisted)
  );
  
  // Methods
  function applyFilters(newFilters: FilterState): void;
  function createView(data: Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>): SavedView;
  function updateView(id: string, data: Partial<SavedView>): void;
  function deleteView(id: string): void;
  function activateView(id: string): void;
  function resetFilters(): void;
  
  // Internal
  function syncToLocalStorage(): void;
  function syncToUrl(): void;
  function loadFromLocalStorage(): void;
  function loadFromUrl(): void;
  
  return {
    filters,
    savedViews,
    activeViewId,
    activeView,
    persistedViews,
    applyFilters,
    createView,
    updateView,
    deleteView,
    activateView,
    resetFilters
  };
}
```

### 3.2 Phase 2: UI Components

#### TabsBar.vue
**Priority: HIGH**

Features:
- Render tabs for persisted views
- Active tab highlighting
- Add new view button (+)
- Tab context menu (edit, delete)
- Responsive design

```vue
<template>
  <div class="tabs-bar">
    <button
      v-for="view in persistedViews"
      :key="view.id"
      :class="{ active: activeViewId === view.id }"
      @click="activateView(view.id)"
    >
      {{ view.name }}
    </button>
    <button class="add-view-btn" @click="openCreateModal">
      +
    </button>
  </div>
</template>
```

#### CreateViewModal.vue
**Priority: HIGH**

Features:
- Compact modal dialog (not sidebar)
- Filter field inputs (dynamic based on table)
- View name input
- "Persist this View?" toggle
- Cancel / Save & Apply buttons
- Edit mode support

```vue
<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {{ mode === 'create' ? 'Create New View' : 'Edit View' }}
        </DialogTitle>
      </DialogHeader>
      
      <!-- Filter Fields -->
      <div class="filter-fields">
        <!-- Dynamic filter inputs -->
      </div>
      
      <!-- View Configuration -->
      <div class="view-config">
        <input v-model="viewName" placeholder="View Name" />
        <label>
          <input type="checkbox" v-model="persistView" />
          Persist this View?
        </label>
      </div>
      
      <DialogFooter>
        <button @click="cancel">Cancel</button>
        <button @click="saveAndApply">Save & Apply</button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

#### MainTablePage.vue
**Priority: HIGH**

Integration example showing how all pieces connect:

```vue
<template>
  <div class="table-page">
    <TabsBar />
    <DataTable :filters="filters" />
    <CreateViewModal />
  </div>
</template>

<script setup lang="ts">
const { filters, applyFilters } = useDataFilters('orders-table');

// Table data fetching with filters
const { data, refetch } = useQuery({
  queryKey: ['orders', filters],
  queryFn: () => fetchOrders(filters.value)
});

// Watch filters and refetch
watch(filters, () => refetch(), { deep: true });
</script>
```

### 3.3 Phase 3: Advanced Features

**Priority: MEDIUM**

- View sharing via URL
- Default view configuration
- View templates/presets
- Bulk operations
- View analytics (usage tracking)

---

## 4. Implementation Details

### 4.1 URL Synchronization Strategy

```typescript
function syncToUrl(filters: FilterState): void {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    
    if (Array.isArray(value)) {
      params.set(key, value.join(','));
    } else if (value instanceof Date) {
      params.set(key, value.toISOString());
    } else if (typeof value === 'object') {
      params.set(key, JSON.stringify(value));
    } else {
      params.set(key, String(value));
    }
  });
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

function loadFromUrl(): FilterState {
  const params = new URLSearchParams(window.location.search);
  const filters: FilterState = {};
  
  params.forEach((value, key) => {
    // Parse based on expected type
    if (value.includes(',')) {
      filters[key] = value.split(',');
    } else if (!isNaN(Number(value))) {
      filters[key] = Number(value);
    } else if (value === 'true' || value === 'false') {
      filters[key] = value === 'true';
    } else {
      try {
        filters[key] = JSON.parse(value);
      } catch {
        filters[key] = value;
      }
    }
  });
  
  return filters;
}
```

### 4.2 LocalStorage Management

```typescript
const STORAGE_KEY_PREFIX = 'saved_views_';

function saveToLocalStorage(tableId: string, data: any): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}${tableId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function loadFromLocalStorage(tableId: string): any {
  try {
    const key = `${STORAGE_KEY_PREFIX}${tableId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}
```

### 4.3 Filter Application Logic

```typescript
function applyFilters(newFilters: FilterState): void {
  // Merge with existing filters
  filters.value = { ...filters.value, ...newFilters };
  
  // Remove null/undefined values
  Object.keys(filters.value).forEach(key => {
    if (filters.value[key] === null || filters.value[key] === undefined) {
      delete filters.value[key];
    }
  });
  
  // Sync to URL
  syncToUrl(filters.value);
  
  // Sync to localStorage if active view
  if (activeViewId.value) {
    const view = savedViews.value.find(v => v.id === activeViewId.value);
    if (view) {
      view.filters = { ...filters.value };
      view.updatedAt = Date.now();
      syncToLocalStorage();
    }
  }
}
```

---

## 5. User Experience Flow

### 5.1 Creating a New View

1. User clicks **[+]** button in tabs bar
2. Modal opens with current filters pre-filled
3. User adjusts filters, enters view name
4. User toggles "Persist this View?" (default: ON)
5. User clicks "Save & Apply"
6. System:
   - Generates unique ID
   - Saves to localStorage
   - Adds tab (if persisted)
   - Updates URL
   - Refreshes table
7. Modal closes

### 5.2 Editing an Existing View

1. User right-clicks tab or clicks edit icon
2. Modal opens in edit mode with view data
3. User modifies filters/name
4. User clicks "Save & Apply"
5. System updates view and refreshes table

### 5.3 Switching Views

1. User clicks different tab
2. System:
   - Loads view filters
   - Updates URL
   - Refreshes table
   - Saves active view ID to localStorage

### 5.4 Temporary Filters (Non-Persisted)

1. User applies filters without saving as view
2. Filters update URL but don't create tab
3. On page reload, filters are restored from URL
4. User can save as view later

---

## 6. Edge Cases & Considerations

### 6.1 Conflict Resolution

**Scenario**: URL params conflict with localStorage
**Solution**: URL params take precedence on initial load

### 6.2 Storage Limits

**Issue**: LocalStorage 5MB limit
**Solution**: 
- Limit to 50 views per table
- Implement LRU eviction
- Compress filter data

### 6.3 Browser Back/Forward

**Issue**: URL changes but state doesn't sync
**Solution**: Listen to `popstate` event and reload filters

```typescript
window.addEventListener('popstate', () => {
  const urlFilters = loadFromUrl();
  applyFilters(urlFilters);
});
```

### 6.4 Multiple Tabs/Windows

**Issue**: LocalStorage changes in one tab don't reflect in others
**Solution**: Listen to `storage` event

```typescript
window.addEventListener('storage', (e) => {
  if (e.key?.startsWith(STORAGE_KEY_PREFIX)) {
    loadFromLocalStorage();
  }
});
```

---

## 7. Testing Strategy

### 7.1 Unit Tests

- Filter serialization/deserialization
- URL param encoding/decoding
- LocalStorage CRUD operations
- View activation logic

### 7.2 Integration Tests

- Create view → verify tab appears
- Switch views → verify table updates
- Edit view → verify changes persist
- Delete view → verify cleanup

### 7.3 E2E Tests

- Full user flow: create → apply → switch → edit → delete
- URL sharing: copy URL → open in new tab → verify filters
- Browser navigation: back/forward buttons work correctly

---

## 8. Performance Considerations

### 8.1 Debouncing

Debounce URL updates to avoid excessive history entries:

```typescript
const debouncedSyncToUrl = useDebounceFn(syncToUrl, 300);
```

### 8.2 Lazy Loading

Load saved views only when tabs bar is visible:

```typescript
const { savedViews } = useDataFilters('orders-table', {
  lazy: true
});
```

### 8.3 Memoization

Cache computed filter results:

```typescript
const activeFilters = computed(() => {
  return Object.entries(filters.value)
    .filter(([_, value]) => value !== null)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
});
```

---

## 9. Accessibility Requirements

- Keyboard navigation for tabs (Arrow keys, Enter, Space)
- ARIA labels for screen readers
- Focus management in modal
- High contrast mode support
- Reduced motion support

```vue
<button
  role="tab"
  :aria-selected="activeViewId === view.id"
  :aria-label="`View: ${view.name}`"
  @keydown.arrow-right="selectNextTab"
  @keydown.arrow-left="selectPrevTab"
>
  {{ view.name }}
</button>
```

---

## 10. Migration & Rollout Plan

### Phase 1: Core Implementation (Week 1-2)
- Implement useDataFilters composable
- Build TabsBar component
- Build CreateViewModal component
- Basic localStorage persistence

### Phase 2: Integration (Week 3)
- Integrate with existing tables
- URL synchronization
- Testing & bug fixes

### Phase 3: Polish (Week 4)
- Advanced features (edit, delete, context menu)
- Accessibility improvements
- Performance optimization
- Documentation

---

## 11. Future Enhancements

- **Backend Persistence**: Sync views to server for cross-device access
- **View Sharing**: Share views with team members
- **View Templates**: Pre-built views for common use cases
- **View Analytics**: Track which views are most used
- **Smart Suggestions**: AI-powered filter recommendations
- **View Versioning**: Track changes to views over time
- **Bulk Operations**: Apply view to multiple tables

---

## 12. Code Examples

See implementation files:
- `composables/useDataFilters.ts` - Core composable
- `components/table/TabsBar.vue` - Tabs component
- `components/table/CreateViewModal.vue` - Modal component
- `pages/example/orders.vue` - Integration example

---

## 13. References & Resources

- Vue 3 Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
- LocalStorage Best Practices: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- URL State Management: https://router.vuejs.org/guide/essentials/navigation.html
- Accessibility Guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

---

## Appendix A: Complete Type Definitions

```typescript
// types/saved-views.ts

export interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
  persisted: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface FilterState {
  [key: string]: any;
}

export interface UseDataFiltersOptions {
  tableId: string;
  lazy?: boolean;
  autoSync?: boolean;
  storageKey?: string;
}

export interface UseDataFiltersReturn {
  filters: Ref<FilterState>;
  savedViews: Ref<SavedView[]>;
  activeViewId: Ref<string | null>;
  activeView: ComputedRef<SavedView | undefined>;
  persistedViews: ComputedRef<SavedView[]>;
  applyFilters: (filters: FilterState) => void;
  createView: (data: Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>) => SavedView;
  updateView: (id: string, data: Partial<SavedView>) => void;
  deleteView: (id: string) => void;
  activateView: (id: string) => void;
  resetFilters: () => void;
}
```

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-26  
**Author**: ClustR Development Team  
**Status**: Research & Planning Phase
