# Copilot Instructions - Clustr Frontend

## 🎯 **Core Philosophy: Build for Real Users, Not Imaginary Ones**

The current implementations are impressive technically but fail the **"Will a property manager at 2 AM actually use this?"** test.

**YAGNI (You Aren't Gonna Need It) principle applies heavily here.** Build for your actual users, not for the imaginary power users who might exist someday.

### ✅ **Do This**
- **Simple, focused solutions** that solve immediate problems
- **Leverage existing tools** (Nuxt's `useLazyAsyncData` over custom data managers)
- **Practical features** that property managers will actually use
- **Clear, predictable UI** that works when users are tired/stressed
- **Fast, responsive interactions** for daily workflow efficiency

### ❌ **Don't Do This**
- Complex abstractions for theoretical future requirements
- Over-engineered composables with every possible feature
- Advanced features that 95% of users will never touch
- Technical complexity for the sake of technical elegance
- Solutions that require extensive documentation to understand

---

## 🏗️ **Technical Stack & Resources**

### **Available Components**
- **UI Components**: `~/components/ui/*` - Complete shadcn/ui component library
- **Shared Components**: `~/components/shared/*` - Reusable business components
  - `GenericTable.vue` - Focused data table with server/client/infinite modes
  - `DynamicSelect.vue` - Smart select component
  - `FileUpload.vue` - File handling component
  - `InfiniteLoader.vue` - Pagination component

### **Global Plugins & Utilities**
- **API Client**: `$api` - Available in all components via `plugins/api.client.ts`
  ```vue
  <!-- Automatic camelCase ↔ snake_case transformation -->
  const { data } = await $api('/bills', { query: { pageSize: 20 } })
  // Frontend: pageSize → Backend: page_size
  // Backend: due_date → Frontend: dueDate
  ```
- **Formatters**: `$formatters` - Available in all components via `plugins/formatters.client.js`
  ```vue
  <!-- Use anywhere in templates -->
  {{ $formatters.currency(amount) }}
  {{ $formatters.date(dueDate) }}
  {{ $formatters.percentage(value) }}
  ```
- **Base Styling**: `assets/css/main.css` - Core Tailwind styles and custom utilities

### **Data Management Philosophy**
- **Use `$api` for all HTTP requests**: Handles camelCase ↔ snake_case transformation automatically
- **Use Nuxt's built-in tools first**: `useLazyAsyncData`, `$fetch`, `refresh()`
- **Keep composables focused**: Single responsibility, not feature-complete abstractions
- **Server-side rendering**: Leverage Nuxt's SSR capabilities
- **Simple state management**: Reactive refs and computed properties

---

## 📋 **Component Development Guidelines**

### **1. Start Simple, Stay Simple**
```vue
<!-- ✅ Good: Simple, focused component -->
<template>
  <div class="bill-list">
    <GenericTable 
      :data="bills" 
      :columns="columns"
      @edit="editBill"
    />
  </div>
</template>

<script setup>
const { data: bills } = useLazyAsyncData('bills', () => $api('/bills'))
const editBill = (bill) => navigateTo(`/bills/${bill.id}/edit`)
</script>
```

### **2. Use Available Resources**
```vue
<!-- ✅ Leverage existing components and plugins -->
<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $formatters.currency(total) }}</CardTitle>
    </CardHeader>
    <CardContent>
      <GenericTable :data="payments" :columns="paymentColumns" />
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import GenericTable from '~/components/shared/GenericTable.vue'
</script>
```

### **3. Permission-Based UI**
```vue
<!-- ✅ Simple permission checks -->
<template>
  <div>
    <Button v-if="canManage('bills')" @click="createBill">
      Create Bill
    </Button>
  </div>
</template>

<script setup>
const { canManage } = usePermissions()
</script>
```

---

## 🎯 **Real User Scenarios**

### **Property Manager at 2 AM**
- **Scenario**: Emergency repair needs quick bill approval
- **Need**: Fast, obvious path to approve/reject
- **Don't Need**: Complex workflow engine with 15 configuration options

### **Accountant During Month-End**
- **Scenario**: Processing 200+ bills for quarterly report
- **Need**: Bulk actions, quick filters, export functionality
- **Don't Need**: Advanced analytics dashboard with real-time charts

### **Maintenance Staff on Mobile**
- **Scenario**: Submitting repair requests while on-site
- **Need**: Simple form, photo upload, offline capability
- **Don't Need**: Complex multi-step wizard with validation framework

---

## 🚫 **Anti-Patterns to Avoid**

### **1. Over-Abstraction**
```javascript
// ❌ Bad: Theoretical future-proofing
const useAdvancedDataManager = (options) => {
  // 500 lines of cache management, retry logic, real-time sync...
}

// ✅ Good: Solve the actual problem
const { data, refresh } = useLazyAsyncData('bills', fetchBills)
```

### **2. Feature Creep**
```vue
<!-- ❌ Bad: Everything and the kitchen sink -->
<GenericTable 
  :enable-virtual-scrolling="true"
  :enable-real-time-updates="true"
  :enable-advanced-filtering="true"
  :enable-bulk-actions="true"
  :enable-export-to-17-formats="true"
/>

<!-- ✅ Good: What they actually need -->
<GenericTable 
  :data="bills"
  :columns="columns"
  :enable-search="true"
  @edit="editBill"
/>
```

### **3. Complex State Management**
```javascript
// ❌ Bad: Overly complex reactivity
const state = reactive({
  bills: [],
  filters: {},
  pagination: {},
  sorting: {},
  cache: new Map(),
  subscriptions: new Set()
})

// ✅ Good: Simple, focused state
const bills = ref([])
const search = ref('')
const selectedStatus = ref('')
```

---

## 📝 **Code Review Checklist**

Before implementing any feature, ask:

1. **Real User Test**: Would a property manager at 2 AM find this helpful or confusing?
2. **YAGNI Check**: Are we building for actual requirements or theoretical ones?
3. **Simplicity**: Can this be solved with existing Nuxt/Vue patterns?
4. **Resource Usage**: Are we using available UI components and plugins?
5. **Performance**: Does this solve a real performance problem or create complexity?

---

## 🎨 **UI/UX Guidelines**

### **Visual Hierarchy**
- Use existing `ui` components for consistency
- Stick to established spacing and typography from `main.css`
- Clear visual feedback for actions and states

### **Interaction Patterns**
- Predictable button placement and behavior
- Consistent form validation and error handling
- Mobile-first responsive design

### **Data Display**
- Use `GenericTable.vue` for tabular data
- Leverage `$formatters` for consistent data presentation
- Show loading states and empty states clearly

---

## 🔧 **Technical Implementation Notes**

### **File Structure**
- **Pages**: Business logic and data fetching
- **Components**: Reusable UI elements
- **Composables**: Focused, single-purpose utilities
- **Plugins**: Global functionality (formatters, API client)

### **Performance Priorities**
1. **Server-side rendering** for initial page loads
2. **Client-side navigation** for subsequent interactions
3. **Lazy loading** for non-critical components
4. **Efficient data fetching** with proper caching

### **Error Handling**
- Graceful degradation for network issues
- Clear error messages for user actions
- Fallback states for missing data

---

**Remember: The goal is not to build the most technically impressive system, but the most useful one for people managing properties.**
