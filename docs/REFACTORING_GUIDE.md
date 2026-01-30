# Clustr Frontend Component Refactoring Guide

This document captures all refactoring work completed and the architectural patterns established for future reference.

---

## 🎯 Core Principles Established

### 1. Strict Component Separation Rules
- **No inline `<Card>`, `<Table>`, `<Select>` compositions in page files (`index.vue`)**
- Dashboard pages should only contain layout structure and calls to high-level domain components
- All card compositions must be their own component (e.g., `BillCard.vue`, `MetricCard.vue`)
- All select field compositions must be encapsulated in filter components or dedicated select wrappers

### 2. Filter Component Pattern
For pages using `useDataFilters`, create a `filtersModel` computed property:

```typescript
const { currentQuery, clearFilters, setFilter } = useDataFilters(filterDefinitions, {
    persistKey: 'your-filters-key'
})

const filtersModel = computed({
    get: () => currentQuery.value,
    set: (newFilters: any) => {
        Object.entries(newFilters).forEach(([key, value]) => {
            setFilter(key, value as string)
        })
    }
})
```

Then bind with `v-model`:
```vue
<YourFilterComponent v-model="filtersModel" @clear="clearFilters" />
```

### 3. Component Naming Conventions
| Type | Pattern | Example |
|------|---------|---------|
| Filter Forms | `{Domain}FilterForm.vue` or `{Domain}FilterPanel.vue` | `BillsFilterForm.vue` |
| Table Content | `{Domain}TableContent.vue` | `BillsTableContent.vue` |
| Grid Content | `{Domain}GridContent.vue` | `AnnouncementsGridContent.vue` |
| List Content | `{Domain}ListContent.vue` | `RecurringPaymentsListContent.vue` |
| Calendar Controls | `{Domain}CalendarControls.vue` | `ShiftCalendarControls.vue` |

---

## ✅ Components Created

### Shared Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `SearchBarWithFilter` | `components/portal/common/` | Reusable search + filter toggle bar |

### Payments Module
| Component | Location | Purpose |
|-----------|----------|---------|
| `BillsFilterForm` | `components/payments/bills/` | Bill filtering logic |
| `BillsTableContent` | `components/payments/bills/` | Bill table with actions |
| `RecurringFilterForm` | `components/payments/recurring/` | Recurring payment filters |
| `RecurringPaymentsListContent` | `components/payments/recurring/` | Recurring payment cards list |
| `RecentTransactionsContent` | `components/payments/wallet/` | Wallet transaction list |

### Portal Module
| Component | Location | Purpose |
|-----------|----------|---------|
| `AnnouncementsFilterPanel` | `components/portal/announcements/` | Announcements filtering |
| `AnnouncementsGridContent` | `components/portal/announcements/` | Announcements card grid |
| `EmergencyFilterForm` | `components/portal/emergency/` | Emergency alerts filtering |
| `HelpdeskFilterPanel` | `components/portal/helpdesk/` | Helpdesk ticket filtering |
| `HelpdeskTicketsGridContent` | `components/portal/helpdesk/` | Ticket cards grid |

### Shift Module
| Component | Location | Purpose |
|-----------|----------|---------|
| `ShiftCalendarControls` | `components/shift/` | Month navigation (prev/next/today) |
| `ShiftFilterBar` | `components/shift/` | Shift type & status filters |
| `ShiftCalendarGrid` | `components/shift/` | Full calendar grid with popovers |
| `ShiftReportsFilter` | `components/shift/reports/` | Report date/type/status filters |
| `ShiftReportsTable` | `components/shift/reports/` | Attendance report table |
| `MaintenanceSchedulesFilter` | `components/shift/maintenance/` | Schedule search & frequency filter |
| `MaintenanceSchedulesTable` | `components/shift/maintenance/` | Schedules table with actions |

---

## 📁 Pages Refactored

| Page | Status | Lines Removed |
|------|--------|---------------|
| `payments/bills/index.vue` | ✅ Complete | ~60 lines |
| `payments/recurring.vue` | ✅ Complete | ~70 lines |
| `payments/wallet.vue` | ✅ Complete | ~35 lines |
| `portal/announcements/index.vue` | ✅ Complete | ~20 lines |
| `portal/helpdesk/index.vue` | ✅ Complete | ~20 lines |
| `portal/emergency/index.vue` | ✅ Complete | ~30 lines |
| `shift/index.vue` | ✅ Complete | ~120 lines |
| `shift/reports.vue` | ✅ Complete | ~130 lines |
| `shift/maintenance/schedules.vue` | ✅ Complete | ~70 lines |

**Total: ~555+ lines eliminated**

---

## 🔧 Known Issues & Fixes Applied

### 1. Missing `viewPayment` in recurring.vue
**Fix:** Added function that delegates to `editPayment`:
```typescript
const viewPayment = (payment: RecurringPayment) => {
    editPayment(payment)
}
```

### 2. Missing `deleteSchedule` in maintenance/schedules.vue
**Status:** Function referenced but not implemented. Needs implementation if delete functionality is required.

### 3. Missing `viewTransaction` in wallet.vue
**Status:** Referenced in component but handler not implemented. Needs implementation.

---

## 📋 Remaining Pages to Refactor

Based on user mentions, these pages may need similar treatment:

| Page | Status | Notes |
|------|--------|-------|
| `shift/staff/index.vue` | ❓ Not checked | May have inline tables/filters |
| `shift/maintenance/requests.vue` | ❓ Not checked | Maintenance requests |
| `shift/maintenance/logs.vue` | ❓ Not checked | Maintenance logs |

---

## 🏗️ Template for New Refactors

### Step 1: Identify Inline Compositions
Look for these patterns in page files:
- `<Card><CardContent>...</CardContent></Card>` blocks
- `<Table>...</Table>` blocks
- `<Select>...</Select>` blocks
- Loading/Empty state logic repeated inline

### Step 2: Create Filter Component
```vue
<template>
    <div class="flex gap-4">
        <Select :model-value="modelValue.fieldName" @update:model-value="updateFilter('fieldName', $event)">
            <!-- options -->
        </Select>
    </div>
</template>

<script setup lang="ts">
interface Filters { fieldName?: string }

const props = defineProps<{ modelValue: Filters }>()
const emit = defineEmits<{ 'update:modelValue': [value: Filters] }>()

const updateFilter = (key: keyof Filters, value: string) => {
    emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>
```

### Step 3: Create Content Component
```vue
<template>
    <div v-if="isLoading"><!-- skeleton --></div>
    <div v-else-if="data.length === 0"><EmptyState /></div>
    <div v-else><!-- actual content --></div>
</template>

<script setup lang="ts">
defineProps<{ data: Item[], isLoading: boolean }>()
defineEmits<{ view: [item: Item], edit: [item: Item] }>()
</script>
```

### Step 4: Integrate in Page
```vue
<FilterComponent v-model="filtersModel" @clear="clearFilters" />
<ContentComponent :data="items" :is-loading="loading" @view="viewItem" />
```

---

## 📝 User Preferences Noted

1. **Minimal inline comments** - Use docstrings instead
2. **Module-level imports only** - No function-level imports
3. **Strict component separation** - No UI primitives in page files
4. **Consistent naming** - Follow established patterns above

---

*Last updated: 2026-01-26*
