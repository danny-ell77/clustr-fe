# Saved Views System - Research & Implementation Plan

## Research Summary

### Existing Patterns Analysis

#### 1. **Current Filtering Implementation**
- **Composable**: `useDataFilters.ts` already exists
- **Current Features**:
  - Filter state management with localStorage persistence
  - URL query parameter synchronization
  - Search, filter, and sort capabilities
  - Reactive state with computed queries
- **Usage Pattern**: Used in visitor logs, maintenance logs, and announcements pages

#### 2. **UI Component Library**
- **Dialog System**: Reka UI-based dialogs (Dialog, DialogContent, DialogHeader, etc.)
- **Tabs System**: Reka UI-based tabs (Tabs, TabsList, TabsTrigger, TabsContent)
- **Form Components**: Input, Select, Label, Textarea, Checkbox, Button
- **Styling**: Tailwind CSS with utility classes

#### 3. **Data Fetching Pattern**
- **Library**: TanStack Query (Vue Query)
- **Pattern**: Composables return query objects with reactive filters
- **Example**: `useVisitorLogs(filters)` where filters is a Ref<FilterType>

#### 4. **Current Filter UI Patterns**
All pages follow similar structure:
```vue
<Card>
  <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
  <CardContent>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Filter inputs -->
    </div>
    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-muted-foreground">Showing X of Y</div>
      <Button variant="outline" @click="clearFilters">Clear Filters</Button>
    </div>
  </CardContent>
</Card>
```

### Gap Analysis

#### What's Missing for Saved Views:
1. **View Management**: No concept of "saved views" in current `useDataFilters`
2. **View Persistence**: Need to store multiple named filter configurations
3. **Tab Integration**: No tab-based view switching
4. **View CRUD**: Create, update, delete, activate views
5. **URL Sync for Views**: Need to sync active view ID to URL
6. **Modal for View Builder**: Need dedicated UI for creating/editing views

## Implementation Strategy

### Phase 1: Extend `useDataFilters` Composable
**Goal**: Add saved views capability without breaking existing usage

**New Features**:
- `savedViews` - array of saved view objects
- `activeViewId` - currently selected view
- `createView(name, filters, persisted)` - save current filters as view
- `updateView(id, data)` - update existing view
- `deleteView(id)` - remove view
- `activateView(id)` - switch to a view
- `resetToDefaultView()` - clear all filters

**Storage Structure**:
```typescript
interface SavedView {
  id: string
  name: string
  filters: FilterState
  persisted: boolean
  createdAt: string
  updatedAt: string
}

// LocalStorage keys:
// {persistKey}-views → SavedView[]
// {persistKey}-active-view → string (view ID)
```

### Phase 2: Create View Management Components

#### 2.1 `ViewTabsBar.vue`
- Renders Chrome-style trapezoid tabs for each saved view
- "All" default tab
- "+" button to create new view
- Tab click activates view
- Close button (×) on each tab for deletion
- Hover effects and active state styling

**Chrome Tab Styling**:
```css
/* Trapezoid shape using clip-path */
.tab {
  clip-path: polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%);
  /* Creates slanted edges */
}

/* Active tab appears "in front" */
.tab-active {
  background: white;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Inactive tabs are slightly recessed */
.tab-inactive {
  background: #f1f3f4;
  opacity: 0.8;
}
```

#### 2.2 `ViewBuilderDialog.vue`
- Modal for creating/editing views
- Filter inputs (dynamic based on filterDefinitions)
- View name input
- "Persist this view" toggle
- Preview of current filters
- Save & Apply / Cancel buttons

#### 2.3 `ViewTabMenu.vue` (Optional)
- Dropdown menu for tab actions
- Edit, Duplicate, Delete options

### Phase 3: Integration Pattern

**Example Usage**:
```vue
<template>
  <div class="space-y-6">
    <!-- Chrome-style Saved Views Tabs -->
    <ViewTabsBar
      :views="savedViews"
      :active-view-id="activeViewId"
      @activate="activateView"
      @create="openViewBuilder"
      @delete="deleteView"
    />

    <!-- Table/Content -->
    <DataTable :data="items" />

    <!-- View Builder Modal -->
    <ViewBuilderDialog
      v-model:open="showViewBuilder"
      :filter-definitions="filterDefinitions"
      :current-filters="currentFilters"
      :view="editingView"
      @save="handleSaveView"
    />
  </div>
</template>

<script setup>
const { 
  savedViews, 
  activeViewId, 
  currentQuery,
  createView,
  updateView,
  deleteView,
  activateView 
} = useDataFilters(filterDefinitions, {
  persistKey: 'visitor-logs-filters',
  enableSavedViews: true
})
</script>
```

**Visual Reference**:
```
┌─────────┐┌─────────────┐┌──────────┐  ┌───┐
│   All   ││ Pending Ord ││ High Val │  │ + │
└─────────┘└─────────────┘└──────────┘  └───┘
  Active      Inactive       Inactive    New
```

## Technical Decisions

### 1. **Backward Compatibility**
- Saved views feature is opt-in via `enableSavedViews: true` option
- Existing pages continue to work without changes
- Default behavior unchanged

### 2. **URL Strategy**
- Active view ID in URL: `?view=abc123`
- View filters NOT in URL (stored in localStorage)
- On page load: Check URL for `view` param → activate that view
- Temporary filters (non-persisted) → filters in URL, no view param

### 3. **Storage Strategy**
- **Saved Views**: localStorage with key `{persistKey}-views`
- **Active View**: localStorage with key `{persistKey}-active-view`
- **Sync**: Watch for changes and update localStorage
- **Hydration**: Load on composable initialization

### 4. **View ID Generation**
```typescript
const generateViewId = () => `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
```

### 5. **Default "All" View**
- Not stored in savedViews array
- Represents empty filter state
- Always available, cannot be deleted
- ID: `'all'`

## Component Architecture

```
useDataFilters (Enhanced)
├── State Management
│   ├── filterState (existing)
│   ├── savedViews (new)
│   └── activeViewId (new)
├── Filter Actions (existing)
│   ├── setFilter
│   ├── setSearch
│   └── clearFilters
└── View Actions (new)
    ├── createView
    ├── updateView
    ├── deleteView
    ├── activateView
    └── duplicateView

ViewTabsBar.vue
├── Renders tabs from savedViews
├── Handles tab switching
├── "+" button for new view
└── Context menu for actions

ViewBuilderDialog.vue
├── Dynamic filter inputs
├── View name input
├── Persist toggle
├── Filter preview
└── Save/Cancel actions
```

## Implementation Checklist

### Core Composable
- [ ] Add SavedView interface
- [ ] Add savedViews reactive state
- [ ] Add activeViewId reactive state
- [ ] Implement createView()
- [ ] Implement updateView()
- [ ] Implement deleteView()
- [ ] Implement activateView()
- [ ] Implement duplicateView()
- [ ] Add localStorage persistence for views
- [ ] Add URL sync for active view
- [ ] Add backward compatibility flag

### UI Components
- [ ] Create ViewTabsBar.vue
- [ ] Create ViewBuilderDialog.vue
- [ ] Create ViewTabMenu.vue (optional)
- [ ] Add filter input renderer utility
- [ ] Add view validation logic

### Integration
- [ ] Update one existing page as example
- [ ] Test with different filter types
- [ ] Test persistence across page reloads
- [ ] Test URL sharing
- [ ] Document usage patterns

## Chrome-Style Tab Styling Details

### Visual Design
```
Background Bar: #dee1e6 (light gray)
┌────────────────────────────────────────────────────────────┐
│  ╱────────╲  ╱──────────────╲  ╱──────────╲      ┌───┐   │
│ │   All    ││ Pending Orders ││  High Val  │     │ + │   │
│  ╲────────╱  ╲──────────────╱  ╲──────────╱      └───┘   │
└────────────────────────────────────────────────────────────┘
   Active       Inactive           Inactive         Button
   (white)      (gray)             (gray)
```

### CSS Implementation Strategy

**Trapezoid Shape Options**:

1. **CSS clip-path** (Recommended - Clean, performant)
```css
.chrome-tab {
  position: relative;
  padding: 10px 20px;
  clip-path: polygon(
    12px 0%,              /* Top-left with angle */
    calc(100% - 12px) 0%, /* Top-right with angle */
    100% 100%,            /* Bottom-right */
    0% 100%               /* Bottom-left */
  );
}
```

2. **SVG Background** (Alternative - More control)
```vue
<svg class="tab-shape">
  <path d="M 12,0 L calc(100% - 12),0 L 100%,100% L 0,100% Z" />
</svg>
```

3. **Pseudo-elements** (Fallback - Better browser support)
```css
.chrome-tab::before,
.chrome-tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 12px;
  height: 100%;
  background: inherit;
}
.chrome-tab::before {
  left: -6px;
  transform: skewX(20deg);
}
.chrome-tab::after {
  right: -6px;
  transform: skewX(-20deg);
}
```

### Complete Tab Styling

```css
/* Tab Container */
.tabs-container {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  background: #dee1e6;
  padding: 8px 8px 0;
  border-radius: 8px 8px 0 0;
  overflow-x: auto;
  scrollbar-width: thin;
}

/* Individual Tab */
.chrome-tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  max-width: 240px;
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  clip-path: polygon(12px 0%, calc(100% - 12px) 0%, 100% 100%, 0% 100%);
}

/* Active Tab */
.chrome-tab-active {
  background: white;
  color: #1f2937;
  z-index: 10;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 -2px 0 white;
}

/* Inactive Tab */
.chrome-tab-inactive {
  background: #f1f3f4;
  color: #5f6368;
  opacity: 0.85;
}

.chrome-tab-inactive:hover {
  background: #e8eaed;
  opacity: 1;
}

/* Tab Text (truncate) */
.chrome-tab-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Close Button */
.chrome-tab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.15s ease;
}

.chrome-tab:hover .chrome-tab-close {
  opacity: 0.7;
}

.chrome-tab-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

/* New Tab Button */
.new-tab-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 4px;
  border-radius: 6px;
  background: transparent;
  color: #5f6368;
  cursor: pointer;
  transition: all 0.15s ease;
}

.new-tab-button:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #1f2937;
}
```

### Tailwind CSS Classes (Preferred)

```vue
<template>
  <div class="flex items-end gap-0.5 bg-gray-200 px-2 pt-2 rounded-t-lg overflow-x-auto">
    <!-- Active Tab -->
    <div class="
      relative flex items-center gap-2 
      min-w-[120px] max-w-[240px] h-9 px-4
      bg-white text-gray-900 font-medium text-sm
      cursor-pointer select-none
      transition-all duration-150
      z-10 shadow-sm
      [clip-path:polygon(12px_0%,calc(100%-12px)_0%,100%_100%,0%_100%)]
    ">
      <span class="flex-1 truncate">All</span>
    </div>

    <!-- Inactive Tab -->
    <div class="
      relative flex items-center gap-2
      min-w-[120px] max-w-[240px] h-9 px-4
      bg-gray-100 text-gray-600 font-medium text-sm
      cursor-pointer select-none opacity-85
      hover:bg-gray-200 hover:opacity-100
      transition-all duration-150
      [clip-path:polygon(12px_0%,calc(100%-12px)_0%,100%_100%,0%_100%)]
    ">
      <span class="flex-1 truncate">Pending Orders</span>
      <button class="
        flex items-center justify-center
        w-4 h-4 rounded-full
        opacity-0 group-hover:opacity-70 hover:opacity-100
        hover:bg-black/10 transition-all
      ">×</button>
    </div>

    <!-- New Tab Button -->
    <button class="
      flex items-center justify-center
      w-8 h-8 ml-1 rounded-md
      text-gray-600 hover:bg-black/8 hover:text-gray-900
      transition-all
    ">+</button>
  </div>
</template>
```

## Next Steps

1. **Extend useDataFilters** with saved views functionality
2. **Create ViewTabsBar** component with Chrome-style trapezoid tabs
3. **Create ViewBuilderDialog** component
4. **Integrate** into one page (e.g., visitor logs) as proof of concept
5. **Test** and refine UX
6. **Document** for team adoption
