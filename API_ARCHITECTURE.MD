# ClustR Frontend Architecture Implementation Guide

## 🎯 Project Overview

ClustR is a property management platform. **This frontend project is specifically for the Management App only** - the admin interface for property managers.

**Scope:**
- **Management App**: Admin interface for property managers (THIS PROJECT)
- ~~Members App~~: Resident portal (separate project)
- **Core/Accounts**: Shared utilities and user management (included for admin functionality)

## 🏗️ Architecture Decisions

### 1. API Integration Strategy
- **Use Nuxt's built-in `$fetch`** (no Axios needed)
- **Simple request forwarding** to Django backend
- **Server-side initial data loading** with client-side hydration
- **Automatic case conversion** (camelCase ↔ snake_case) using lodash

### 2. Authentication & Authorization
- **JWT tokens** with httpOnly cookies
- **Access token**: 15 minutes expiry
- **Refresh token**: 7 days expiry
- **Role-based permissions** for management features

### 3. Data Loading Strategy
- **Server-side (SSR)**: Initial page data, user profile, critical state
- **Client-side**: Pagination, filtering, real-time updates, user interactions

### 4. Multi-Tenant Vanity URLs
- **Subdomain routing**: `{cluster-slug}.clustr.com` for branded admin dashboards
- **Public sharing**: Branded links for invoices, bills, receipts, visitor invitations
- **Cluster context**: Automatic cluster detection from subdomain
- **Fallback routing**: Main domain routing for non-cluster URLs
## 📁 Project Structure

```
clustr-fe/
├── composables/
│   ├── useApi.ts                 # Core API client
│   ├── useAuth.ts               # Authentication management
│   ├── usePagination.ts         # Universal pagination/infinite scroll
│   ├── management/              # Management module composables
│   │   ├── usePayments.ts       # Bills, transactions, recurring payments
│   │   ├── useAnnouncements.ts  # Announcements CRUD
│   │   ├── useShifts.ts         # Staff shift management
│   │   ├── useMainenance.ts     # Maintenance logs & schedules
│   │   ├── useHelpdesk.ts       # Issue tickets & comments
│   │   ├── useUsers.ts          # User & role management
│   │   ├── useEvents.ts         # Event & guest management
│   │   └── useEmergency.ts      # SOS alerts & emergency contacts
│   └── core/
│       ├── useUtilities.ts      # Utility payments
│       └── useFiles.ts          # File uploads
├── plugins/
│   ├── api.client.ts            # API client with interceptors
│   └── auth.client.ts           # Auth initialization
├── middleware/
│   ├── auth.ts                  # Route protection
│   ├── permissions.ts           # Permission checks
│   └── cluster.ts               # Cluster context from subdomain
├── server/api/                  # Request forwarding routes
│   ├── auth/[...].ts           # Auth endpoint forwarding
│   ├── management/[...].ts     # Management endpoint forwarding
│   ├── core/[...].ts           # Core utilities forwarding
│   └── public/[...].ts         # Public sharing endpoints
├── types/
│   ├── api.ts                   # API response types
│   ├── auth.ts                  # Auth types
│   ├── management.ts            # Management module types
│   └── cluster.ts               # Cluster/tenant types
└── components/
    ├── shared/
    │   ├── DataTable.vue        # Universal data table
    │   ├── InfiniteLoader.vue   # Infinite scroll component
    │   └── FileUpload.vue       # File upload component
    └── ui/                      # shadcn/ui components
```

## 🔐 Authentication Implementation

### Core Auth Composable
```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const accessToken = useCookie('access_token', { 
    httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60 * 15 
  })
  const refreshToken = useCookie('refresh_token', { 
    httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 
  })
  const user = useState('auth.user', () => null)
  
  const login = async (credentials) => {
    const response = await $fetch('/api/auth/signin/', {
      method: 'POST', body: credentials
    })
    accessToken.value = response.access
    refreshToken.value = response.refresh
    user.value = response.user
  }
  
  const refreshAuthToken = async () => {
    const response = await $fetch('/api/auth/signin/refresh/', {
      method: 'POST', body: { refresh: refreshToken.value }
    })
    accessToken.value = response.access
  }
  
  return { user: readonly(user), login, refreshAuthToken, accessToken }
}
```

### Auth Middleware
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()
  
  if (!user.value) {
    return navigateTo('/login')
  }
  
  // Module-specific permission checks
  if (to.path.startsWith('/management') && 
      !user.value.permissions?.includes('management.view')) {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }
})
```

## 🌐 Simple Request Forwarding

Instead of complex proxy terminology, we're simply forwarding frontend requests to Django backend.

### How It Works

1. **Frontend makes request**: `$fetch('/api/management/bills/')`
2. **Nuxt server receives it**: `server/api/management/[...].ts`
3. **Server forwards to Django**: `fetch('https://backend.django.com/management/bills/')`
4. **Django responds**: Server gets the data
5. **Server sends back to frontend**: Frontend gets the data

### Server Routes with Automatic Token Refresh

Based on the Django OpenAPI spec, the server routes should handle 401 errors by automatically refreshing tokens before retrying requests.

```typescript
// server/api/auth/[...].ts - Auth forwarding (no auth required)
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const method = getMethod(event)
  const body = method !== 'GET' ? await readBody(event) : undefined
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  return await $fetch(`${config.backendUrl}/auth/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body,
    query
  })
})

// Helper function for token refresh
const refreshAccessToken = async (event: any, config: any) => {
  const refreshToken = getCookie(event, 'refresh_token')
  
  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No refresh token available'
    })
  }
  
  try {
    const response = await $fetch(`${config.backendUrl}/auth/signin/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { refresh: refreshToken }
    })
    
    // Update the access token cookie
    setCookie(event, 'access_token', response.access, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 15 // 15 minutes
    })
    
    return response.access
  } catch (error) {
    // If refresh fails, clear both tokens
    deleteCookie(event, 'access_token')
    deleteCookie(event, 'refresh_token')
    throw createError({
      statusCode: 401,
      statusMessage: 'Session expired. Please log in again.'
    })
  }
}

// server/api/management/[...].ts - Management forwarding with auto-refresh
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const method = getMethod(event)
  const body = method !== 'GET' ? await readBody(event) : undefined
  const query = getQuery(event)
  const config = useRuntimeConfig()
  let accessToken = getCookie(event, 'access_token')
  
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  const makeRequest = async (token: string) => {
    return await $fetch(`${config.backendUrl}/management/${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body,
      query
    })
  }
  
  try {
    // First attempt with current token
    return await makeRequest(accessToken)
  } catch (error: any) {
    // If 401 error, try to refresh token and retry
    if (error.statusCode === 401) {
      const newToken = await refreshAccessToken(event, config)
      return await makeRequest(newToken)
    }
    throw error
  }
})

// server/api/core/[...].ts - Core utilities forwarding with optional auth
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const method = getMethod(event)
  const body = method !== 'GET' ? await readBody(event) : undefined
  const query = getQuery(event)
  const config = useRuntimeConfig()
  let accessToken = getCookie(event, 'access_token')
  
  const makeRequest = async (token?: string) => {
    return await $fetch(`${config.backendUrl}/core/${path}`, {
      method,
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'Content-Type': 'application/json'
      },
      body,
      query
    })
  }
  
  if (!accessToken) {
    // For core endpoints, some may not require auth
    return await makeRequest()
  }
  
  try {
    // First attempt with current token
    return await makeRequest(accessToken)
  } catch (error: any) {
    // If 401 error, try to refresh token and retry
    if (error.statusCode === 401) {
      try {
        const newToken = await refreshAccessToken(event, config)
        return await makeRequest(newToken)
      } catch (refreshError) {
        // If refresh fails, try without auth (for public endpoints)
        return await makeRequest()
      }
    }
    throw error
  }
})
```

## 🏢 Multi-Tenant Vanity URLs & Cluster Context

### Subdomain Routing Strategy

ClustR supports vanity URLs where each property cluster gets their own branded subdomain:

- **Admin Dashboard**: `oceanview.clustr.com/dashboard`
- **Public Bills**: `oceanview.clustr.com/bills/xyz-123/pay`
- **Visitor Invitations**: `oceanview.clustr.com/visitors/invite/abc-456`
- **Receipt Sharing**: `oceanview.clustr.com/receipts/def-789`

### Implementation Architecture

```typescript
// nuxt.config.ts - Domain configuration
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      mainDomain: 'clustr.com',
      allowedSubdomains: ['www', 'api', 'cdn'],
      clusterDomainPattern: '*.clustr.com'
    }
  },
  nitro: {
    experimental: {
      wasm: true
    }
  }
})
```

### Cluster Detection Middleware

```typescript
// middleware/cluster.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const host = useRequestHeaders()['host'] || ''
  const config = useRuntimeConfig()
  const cluster = useState('cluster.current', () => null)
  
  // Extract subdomain from host
  const subdomain = extractSubdomain(host, config.public.mainDomain)
  
  if (subdomain && !config.public.allowedSubdomains.includes(subdomain)) {
    // This is a cluster subdomain
    cluster.value = { slug: subdomain }
    
    // Set cluster context for API calls
    useState('cluster.context', () => subdomain)
  } else {
    // Main domain or system subdomain
    cluster.value = null
    useState('cluster.context', () => null)
  }
})

const extractSubdomain = (host: string, mainDomain: string): string | null => {
  const hostParts = host.split('.')
  const domainParts = mainDomain.split('.')
  
  if (hostParts.length > domainParts.length) {
    return hostParts[0]
  }
  
  return null
}
```

### Cluster Context Composable

```typescript
// composables/useCluster.ts
export const useCluster = () => {
  const cluster = useState('cluster.current', () => null)
  const context = useState('cluster.context', () => null)
  
  const isClusterDomain = computed(() => !!cluster.value)
  const clusterSlug = computed(() => cluster.value?.slug)
  
  const getClusterInfo = async () => {
    if (!clusterSlug.value) return null
    
    return await $fetch('/api/public/clusters/info/', {
      query: { slug: clusterSlug.value }
    })
  }
  
  const buildClusterUrl = (path: string, clusteSlug?: string) => {
    const slug = clusteSlug || clusterSlug.value
    const config = useRuntimeConfig()
    
    if (slug) {
      return `https://${slug}.${config.public.mainDomain}${path}`
    }
    
    return path
  }
  
  return {
    cluster: readonly(cluster),
    isClusterDomain,
    clusterSlug,
    getClusterInfo,
    buildClusterUrl
  }
}
```

### Enhanced Server Routes with Cluster Context

```typescript
// server/api/management/[...].ts - Updated with cluster context
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const method = getMethod(event)
  const body = method !== 'GET' ? await readBody(event) : undefined
  const query = getQuery(event)
  const config = useRuntimeConfig()
  let accessToken = getCookie(event, 'access_token')
  
  // Extract cluster context from subdomain
  const host = getHeader(event, 'host') || ''
  const clusterSlug = extractSubdomainFromHost(host, config.public.mainDomain)
  
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  const makeRequest = async (token: string) => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(clusterSlug && { 'X-Cluster-Slug': clusterSlug })
    }
    
    return await $fetch(`${config.backendUrl}/management/${path}`, {
      method,
      headers,
      body,
      query: {
        ...query,
        ...(clusterSlug && { cluster_slug: clusterSlug })
      }
    })
  }
  
  try {
    return await makeRequest(accessToken)
  } catch (error: any) {
    if (error.statusCode === 401) {
      const newToken = await refreshAccessToken(event, config)
      return await makeRequest(newToken)
    }
    throw error
  }
})
```

### Public Sharing Routes

```typescript
// server/api/public/[...].ts - Public endpoints for sharing
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const method = getMethod(event)
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  // Extract cluster context
  const host = getHeader(event, 'host') || ''
  const clusterSlug = extractSubdomainFromHost(host, config.public.mainDomain)
  
  const headers = {
    'Content-Type': 'application/json',
    ...(clusterSlug && { 'X-Cluster-Slug': clusterSlug })
  }
  
  return await $fetch(`${config.backendUrl}/public/${path}`, {
    method,
    headers,
    query: {
      ...query,
      ...(clusterSlug && { cluster_slug: clusterSlug })
    }
  })
})
```

### Branded URL Generation

```typescript
// composables/management/usePublicSharing.ts
export const usePublicSharing = () => {
  const { buildClusterUrl } = useCluster()
  
  const generateBillPaymentUrl = (billId: string, clusterSlug?: string) => {
    return buildClusterUrl(`/bills/${billId}/pay`, clusterSlug)
  }
  
  const generateVisitorInviteUrl = (inviteId: string, clusterSlug?: string) => {
    return buildClusterUrl(`/visitors/invite/${inviteId}`, clusterSlug)
  }
  
  const generateReceiptUrl = (receiptId: string, clusterSlug?: string) => {
    return buildClusterUrl(`/receipts/${receiptId}`, clusterSlug)
  }
  
  const generateAnnouncementUrl = (announcementId: string, clusterSlug?: string) => {
    return buildClusterUrl(`/announcements/${announcementId}`, clusterSlug)
  }
  
  return {
    generateBillPaymentUrl,
    generateVisitorInviteUrl,
    generateReceiptUrl,
    generateAnnouncementUrl
  }
}
```

### Usage in Management Interface

```vue
<!-- components/management/BillActionsMenu.vue -->
<template>
  <DropdownMenu>
    <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="copyPaymentLink">
        📋 Copy Payment Link
      </DropdownMenuItem>
      <DropdownMenuItem @click="sendPaymentReminder">
        📧 Send Payment Reminder
      </DropdownMenuItem>
      <DropdownMenuItem @click="viewReceipt">
        🧾 View Receipt
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
const props = defineProps<{ bill: Bill }>()

const { generateBillPaymentUrl } = usePublicSharing()
const { clusterSlug } = useCluster()

const copyPaymentLink = async () => {
  const paymentUrl = generateBillPaymentUrl(props.bill.id, clusterSlug.value)
  await navigator.clipboard.writeText(paymentUrl)
  // Show success toast
}
</script>
```

### Benefits

1. **Branded Experience**: Each cluster has their own domain and branding
2. **Professional URLs**: Clean, memorable links for sharing
3. **SEO Friendly**: Each cluster gets their own subdomain authority
4. **Multi-tenant Isolation**: Automatic cluster context without manual selection
5. **Flexible Sharing**: Bills, receipts, invitations all use branded URLs

This architecture allows ClustR to provide a white-label experience where each property cluster feels like they have their own dedicated platform while maintaining a single codebase.

### Frontend Usage

```typescript
// composables/management/usePayments.ts
export const usePayments = () => {
  const fetchBills = async (params = {}) => {
    return await $fetch('/api/management/payments/bills/', {
      method: 'GET',
      query: params
    })
  }
  
  const createBill = async (billData) => {
    return await $fetch('/api/management/payments/create_bill/', {
      method: 'POST',
      body: billData
    })
  }
  
  return { fetchBills, createBill }
}
```

### Benefits

- **Frontend thinks it's calling local API**
- **Server just forwards the request to Django**
- **Django doesn't know the difference**
- **Tokens stay secure in httpOnly cookies**
- **Case conversion happens in one place**
## � Core API & Case Conversion

### Core API Composable (Optional - for token refresh)
```typescript
// composables/useApi.ts
export const useApi = () => {
  const { refreshAuthToken } = useAuth()

  const apiCall = async (url: string, options: any = {}) => {
    try {
      return await $fetch(url, options)
    } catch (error) {
      if (error.statusCode === 401) {
        await refreshAuthToken()
        return await $fetch(url, options)
      }
      throw error
    }
  }

  return { apiCall }
}
```

### 🔄 Case Conversion Plugin (CRITICAL FEATURE)

This is the **most important part** of our architecture. It allows the frontend to use consistent camelCase everywhere while Django uses snake_case.

**How it works:**
- **Outgoing requests**: `billNumber` → `bill_number` 
- **Incoming responses**: `created_at` → `createdAt`
- **Deep transformation**: Works on nested objects and arrays
- **Bi-directional**: Handles both request and response transformation

**⚠️ Important**: The plugin creates a custom `$api` instance. Use `$api` instead of `$fetch` to get automatic case conversion.

```typescript
// plugins/api.client.ts
import { camelCase, snakeCase } from 'lodash-es'

const transformKeys = (obj: any, transformer: Function): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item, transformer))
  }
  
  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const transformed = {}
    for (const [key, value] of Object.entries(obj)) {
      transformed[transformer(key)] = transformKeys(value, transformer)
    }
    return transformed
  }
  
  return obj
}

export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: '/api',
    onRequest({ options }) {
      // Convert camelCase to snake_case for outgoing requests
      if (options.body && typeof options.body === 'object') {
        options.body = transformKeys(options.body, snakeCase)
      }
      if (options.query) {
        options.query = transformKeys(options.query, snakeCase)
      }
    },
    onResponse({ response }) {
      // Convert snake_case to camelCase for incoming responses
      if (response._data && typeof response._data === 'object') {
        response._data = transformKeys(response._data, camelCase)
      }
    }
  })

  return { provide: { api } }  // Available as $api in composables
})
```

### Usage in Composables

```typescript
// ✅ Correct - Use $api for automatic case conversion
export const usePayments = () => {
  const { $api } = useNuxtApp()  // Get the custom instance with case conversion
  
  const fetchBills = async (params = {}) => {
    return await $api('/management/payments/bills/', {
      method: 'GET', 
      query: params  // camelCase keys converted automatically
    })
  }
  
  const createBill = async (billData) => {
    return await $api('/management/payments/create_bill/', {
      method: 'POST', 
      body: billData  // camelCase keys converted to snake_case
    })
  }
  
  return { fetchBills, createBill }
}

// ❌ Wrong - Using $fetch directly (no case conversion)
const response = await $fetch('/api/management/bills/', {
  query: { bill_type: 'electricity' }  // Would need manual snake_case
})
```

**Example transformation:**

```typescript
// Frontend sends (camelCase):
const billData = {
  billNumber: "BILL-001",
  dueDate: "2025-12-31",
  createdBy: "admin",
  paymentMethod: "bank_transfer"
}

// Plugin converts to snake_case before sending to Django:
{
  bill_number: "BILL-001",
  due_date: "2025-12-31", 
  created_by: "admin",
  payment_method: "bank_transfer"
}

// Django responds with snake_case:
{
  id: "uuid-123",
  bill_number: "BILL-001",
  created_at: "2025-09-13T10:30:00Z",
  is_overdue: false,
  paid_amount: "150.00"
}

// Plugin converts to camelCase for frontend:
{
  id: "uuid-123",
  billNumber: "BILL-001", 
  createdAt: "2025-09-13T10:30:00Z",
  isOverdue: false,
  paidAmount: "150.00"
}
```
## 📊 Pagination & Data Loading

### Universal Pagination Composable
```typescript
// composables/usePagination.ts
interface PaginationOptions {
  pageSize?: number
  initialFilters?: Record<string, any>
}

interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

export const usePagination = <T>(
  fetchFn: (params: any) => Promise<PaginatedResponse<T>>,
  options: PaginationOptions = {}
) => {
  const items = ref<T[]>([])
  const loading = ref(false)
  const hasNextPage = ref(true)
  const currentPage = ref(1)
  const filters = ref(options.initialFilters || {})

  const loadPage = async (page: number = 1, reset: boolean = false) => {
    if (loading.value) return
    
    loading.value = true
    try {
      const response = await fetchFn({
        page, pageSize: options.pageSize || 20, ...filters.value
      })
      
      if (reset || page === 1) {
        items.value = response.results
      } else {
        items.value.push(...response.results)
      }
      
      hasNextPage.value = !!response.next
      currentPage.value = page
    } finally {
      loading.value = false
    }
  }

  const loadMore = () => {
    if (hasNextPage.value && !loading.value) {
      loadPage(currentPage.value + 1)
    }
  }

  const refresh = () => loadPage(1, true)
  
  const applyFilters = (newFilters: any) => {
    filters.value = { ...filters.value, ...newFilters }
    refresh()
  }

  return { 
    items: readonly(items), 
    loading, 
    hasNextPage, 
    loadMore, 
    refresh, 
    applyFilters 
  }
}
```

### Infinite Loading Component
```vue
<!-- components/shared/InfiniteLoader.vue -->
<template>
  <div>
    <slot :items="items" :loading="loading" />
    <div v-if="hasNextPage" ref="loadMoreTrigger" class="load-more-trigger">
      <div v-if="loading" class="flex items-center justify-center p-4">
        <Spinner class="w-6 h-6" />
        <span class="ml-2">Loading more...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fetchFn: Function
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 20
})

const { items, loading, hasNextPage, loadMore } = usePagination(
  props.fetchFn, { pageSize: props.pageSize }
)

const loadMoreTrigger = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasNextPage.value && !loading.value) {
      loadMore()
    }
  }, { threshold: 0.1 })
  
  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)
  onUnmounted(() => observer.disconnect())
})
</script>
```

## 🏢 Management Module Composables

### Payments
```typescript
// composables/management/usePayments.ts
export const usePayments = () => {
  const fetchBills = async (params = {}) => {
    return await $fetch('/api/management/payments/bills/', {
      method: 'GET', query: params
    })
  }
  
  const createBill = async (billData) => {
    return await $fetch('/api/management/payments/create_bill/', {
      method: 'POST', body: billData
    })
  }
  
  const createBulkBills = async (billsData) => {
    return await $fetch('/api/management/payments/create_bulk_bills/', {
      method: 'POST', body: billsData
    })
  }
  
  const getPaymentDashboard = async () => {
    return await $fetch('/api/management/payments/dashboard/')
  }
  
  const getClusterWallet = async () => {
    return await $fetch('/api/management/payments/cluster_wallet/')
  }
  
  return { 
    fetchBills, 
    createBill, 
    createBulkBills, 
    getPaymentDashboard, 
    getClusterWallet 
  }
}
```

### Announcements
```typescript
// composables/management/useAnnouncements.ts
export const useAnnouncements = () => {
  const fetchAnnouncements = async (params = {}) => {
    return await $fetch('/api/management/announcements/', {
      method: 'GET', query: params
    })
  }
  
  const createAnnouncement = async (data) => {
    return await $fetch('/api/management/announcements/', {
      method: 'POST', body: data
    })
  }
  
  const publishAnnouncement = async (id) => {
    return await $fetch(`/api/management/announcements/${id}/publish/`, {
      method: 'POST'
    })
  }
  
  return { fetchAnnouncements, createAnnouncement, publishAnnouncement }
}
```

### Maintenance
```typescript
// composables/management/useMaintenance.ts
export const useMaintenance = () => {
  const fetchMaintenanceLogs = async (params = {}) => {
    return await $fetch('/api/management/maintenance-logs/', {
      method: 'GET', query: params
    })
  }
  
  const createMaintenanceLog = async (data) => {
    return await $fetch('/api/management/maintenance-logs/', {
      method: 'POST', body: data
    })
  }
  
  const updateMaintenanceStatus = async (id, status) => {
    return await $fetch(`/api/management/maintenance-logs/${id}/`, {
      method: 'PATCH', body: { status }
    })
  }
  
  const fetchMaintenanceSchedules = async (params = {}) => {
    return await $fetch('/api/management/maintenance-schedules/', {
      method: 'GET', query: params
    })
  }
  
  return { 
    fetchMaintenanceLogs, 
    createMaintenanceLog, 
    updateMaintenanceStatus,
    fetchMaintenanceSchedules 
  }
}
```

### Helpdesk
```typescript
// composables/management/useHelpdesk.ts
export const useHelpdesk = () => {
  const fetchIssues = async (params = {}) => {
    return await $fetch('/api/management/helpdesk/issues/', {
      method: 'GET', query: params
    })
  }
  
  const createIssue = async (issueData) => {
    return await $fetch('/api/management/helpdesk/issues/', {
      method: 'POST', body: issueData
    })
  }
  
  const assignIssue = async (issueId, assigneeId) => {
    return await $fetch(`/api/management/helpdesk/issues/${issueId}/assign/`, {
      method: 'POST', body: { assignedTo: assigneeId }
    })
  }
  
  const getIssueStatistics = async () => {
    return await $fetch('/api/management/helpdesk/issues/statistics/')
  }
  
  const addIssueComment = async (issueId, comment) => {
    return await $fetch(`/api/management/helpdesk/issues/${issueId}/comments/`, {
      method: 'POST', body: { content: comment }
    })
  }
  
  return { 
    fetchIssues, 
    createIssue, 
    assignIssue, 
    getIssueStatistics,
    addIssueComment 
  }
}
```

### Shifts Management
```typescript
// composables/management/useShifts.ts
export const useShifts = () => {
  const fetchShifts = async (params = {}) => {
    return await $fetch('/api/management/shifts/', {
      method: 'GET', query: params
    })
  }
  
  const createShift = async (shiftData) => {
    return await $fetch('/api/management/shifts/', {
      method: 'POST', body: shiftData
    })
  }
  
  const cancelShift = async (shiftId) => {
    return await $fetch(`/api/management/shifts/${shiftId}/cancel/`, {
      method: 'POST'
    })
  }
  
  const getShiftStatistics = async () => {
    return await $fetch('/api/management/shifts/statistics/')
  }
  
  const clockIn = async (shiftId) => {
    return await $fetch(`/api/management/shifts/${shiftId}/clock-in/`, {
      method: 'POST'
    })
  }
  
  const clockOut = async (shiftId) => {
    return await $fetch(`/api/management/shifts/${shiftId}/clock-out/`, {
      method: 'POST'
    })
  }
  
  return { 
    fetchShifts, 
    createShift, 
    cancelShift, 
    getShiftStatistics,
    clockIn,
    clockOut 
  }
}
```

### Emergency Management
```typescript
// composables/management/useEmergency.ts
export const useEmergency = () => {
  const fetchSOSAlerts = async (params = {}) => {
    return await $fetch('/api/management/sos-alerts/', {
      method: 'GET', query: params
    })
  }
  
  const acknowledgeAlert = async (alertId) => {
    return await $fetch(`/api/management/sos-alerts/${alertId}/acknowledge/`, {
      method: 'POST'
    })
  }
  
  const resolveAlert = async (alertId, responseData) => {
    return await $fetch(`/api/management/sos-alerts/${alertId}/resolve/`, {
      method: 'POST', body: responseData
    })
  }
  
  const fetchEmergencyContacts = async () => {
    return await $fetch('/api/management/emergency-contacts/')
  }
  
  const fetchEmergencyResponses = async (params = {}) => {
    return await $fetch('/api/management/emergency-responses/', {
      method: 'GET', query: params
    })
  }
  
  return { 
    fetchSOSAlerts, 
    acknowledgeAlert, 
    resolveAlert, 
    fetchEmergencyContacts,
    fetchEmergencyResponses 
  }
}
```

## 🎨 Page Implementation Examples

### Management Bills Page
```vue
<!-- pages/management/payments/bills.vue -->
<template>
  <div class="bills-management">
    <div class="header">
      <h1>Bills Management</h1>
      <Button @click="showCreateBillModal = true">Create Bill</Button>
    </div>
    
    <div class="filters">
      <Input v-model="searchQuery" placeholder="Search bills..." />
      <Select v-model="filters.billType">
        <option value="">All Types</option>
        <option value="electricity">Electricity</option>
        <option value="water">Water</option>
        <option value="security">Security</option>
      </Select>
    </div>
    
    <InfiniteLoader :fetch-fn="fetchBills" :page-size="20">
      <template #default="{ items, loading }">
        <DataTable 
          :data="items" 
          :columns="columns" 
          :actions="tableActions"
          :loading="loading"
        />
      </template>
    </InfiniteLoader>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Bills Management',
  middleware: ['auth', 'permissions']
})

const { fetchBills, createBill } = usePayments()
const searchQuery = ref('')
const filters = ref({ billType: '', status: '' })
const showCreateBillModal = ref(false)

// Server-side initial load
const { data: initialData } = await useLazyAsyncData('bills-list', () =>
  fetchBills({ page: 1, pageSize: 20 }),
  { server: true, default: () => ({ results: [], count: 0 }) }
)

const columns = [
  { key: 'billNumber', label: 'Bill #' },
  { key: 'title', label: 'Title' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status' }
]

const tableActions = [
  { label: 'View', action: (bill) => navigateTo(`/management/payments/bills/${bill.id}`) },
  { label: 'Edit', action: (bill) => editBill(bill) },
  { label: 'Delete', action: (bill) => deleteBill(bill) }
]
</script>
```

### Members Dashboard
```vue
<!-- pages/dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="welcome">
      <h1>Management Dashboard</h1>
      <p>Welcome back, {{ user?.name }}</p>
    </div>
    
    <div class="quick-stats">
      <StatsCard title="Total Bills" :value="dashboardStats?.totalBills" />
      <StatsCard title="Pending Payments" :value="dashboardStats?.pendingPayments" />
      <StatsCard title="Active Users" :value="dashboardStats?.activeUsers" />
    </div>
    
    <div class="recent-activity">
      <h2>Recent Activity</h2>
      <ActivityList :activities="recentActivity" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Management Dashboard',
  middleware: 'auth'
})

const { user } = useAuth()
const { getPaymentDashboard } = usePayments()

// Server-side data loading
const { data: dashboardStats } = await useLazyAsyncData('dashboard-stats', () =>
  getPaymentDashboard()
)

const { data: recentActivity } = await useLazyAsyncData('recent-activity', () =>
  $fetch('/api/management/activity/', { query: { limit: 10 } })
)
</script>
```

## 📝 Type Definitions Based on OpenAPI Spec

**Note**: All types use camelCase naming to maintain consistency in the frontend. The case conversion plugin automatically handles the snake_case ↔ camelCase transformation.

### Core Types
```typescript
// types/api.ts
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  statusCode: number
  statusMessage: string
  data?: any
}

// types/auth.ts
export interface User {
  id: string
  name: string
  emailAddress: string  // Maps to email_address in Django
  phoneNumber: string   // Maps to phone_number in Django
  profileImageUrl?: string  // Maps to profile_image_url in Django
  isVerified: boolean   // Maps to is_verified in Django
  permissions: string[]
  roles: string[]
}

export interface LoginCredentials {
  emailAddress: string  // Converted to email_address for Django
  password: string
}

export interface TokenPair {
  access: string
  refresh: string
}
```

### Management Types
```typescript
// types/management.ts
export interface Bill {
  id: string
  billNumber: string    // Maps to bill_number in Django
  title: string
  description?: string
  type: 'electricity' | 'water' | 'security' | 'maintenance' | 'service_charge' | 'waste_management' | 'other'
  amount: string
  currency: string
  dueDate: string       // Maps to due_date in Django
  paidAmount: string    // Maps to paid_amount in Django
  remainingAmount: string  // Maps to remaining_amount in Django
  isOverdue: boolean    // Maps to is_overdue in Django
  createdAt: string     // Maps to created_at in Django
}

export interface MaintenanceLog {
  id: string
  maintenanceNumber: string    // Maps to maintenance_number in Django
  title: string
  description: string
  maintenanceType: string     // Maps to maintenance_type in Django
  propertyType: string        // Maps to property_type in Django
  propertyLocation: string    // Maps to property_location in Django
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: string
  scheduledDate?: string      // Maps to scheduled_date in Django
  estimatedDuration?: string  // Maps to estimated_duration in Django
  actualDuration?: string     // Maps to actual_duration in Django
  cost?: string
  createdAt: string          // Maps to created_at in Django
}

export interface Shift {
  id: string
  title: string
  shiftType: string          // Maps to shift_type in Django
  assignedStaff: string      // Maps to assigned_staff in Django
  assignedStaffDetails: StaffSummary  // Maps to assigned_staff_details in Django
  startTime: string          // Maps to start_time in Django
  endTime: string            // Maps to end_time in Django
  status: string
  location?: string
  isOverdue: boolean         // Maps to is_overdue in Django
  isUpcoming: boolean        // Maps to is_upcoming in Django
}

export interface SOSAlert {
  id: string
  alertId: string           // Maps to alert_id in Django
  user: string
  userName: string          // Maps to user_name in Django
  emergencyType: string     // Maps to emergency_type in Django
  description?: string
  location?: string
  status: string
  priority: string
  acknowledgedAt?: string   // Maps to acknowledged_at in Django
  acknowledgedBy?: string   // Maps to acknowledged_by in Django
  resolvedAt?: string       // Maps to resolved_at in Django
  resolvedBy?: string       // Maps to resolved_by in Django
  createdAt: string         // Maps to created_at in Django
}

export interface IssueTicket {
  id: string
  issueNo: string           // Maps to issue_no in Django
  title: string
  description: string
  issueType: 'CARPENTRY' | 'PLUMBING' | 'ELECTRICAL' | 'CLEANING' | 'SECURITY' | 'OTHER'  // Maps to issue_type in Django
  status: 'SUBMITTED' | 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  reportedBy: UserSummary   // Maps to reported_by in Django
  assignedTo?: UserSummary  // Maps to assigned_to in Django
  createdAt: string         // Maps to created_at in Django
}

export interface UserSummary {
  id: string
  name: string
  emailAddress: string      // Maps to email_address in Django
  profileImageUrl?: string  // Maps to profile_image_url in Django
}

export interface StaffSummary {
  id: string
  name: string
  phoneNumber: string       // Maps to phone_number in Django
  emailAddress: string      // Maps to email_address in Django
  role: string
}
```

### Members Types
```typescript
// types/members.ts
export interface MemberProfile {
  id: string
  name: string
  emailAddress: string
  phoneNumber: string
  unitAddress?: string
  profileImageUrl?: string
  propertyOwner: boolean
  isVerified: boolean
  isPhoneVerified: boolean
  emergencyContacts: EmergencyContact[]
}

export interface Child {
  id: string
  name: string
  dateOfBirth: string
  gender: 'male' | 'female'
  profilePhoto?: string
  houseNumber: string
  parent: string
  parentName: string
  emergencyContacts: any
  isActive: boolean
  notes?: string
  age: string
  createdAt: string
}

export interface Visitor {
  id: string
  name: string
  email?: string
  phone: string
  estimatedArrival: string
  visitType: 'ONE_TIME' | 'SHORT_STAY' | 'EXTENDED_STAY'
  accessCode: string
  invitedBy: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  validDate: string
  purpose?: string
  notes?: string
  createdAt: string
}

export interface ExitRequest {
  id: string
  requestId: string
  child: string
  childName: string
  requestedBy: string
  reason: string
  expectedReturnTime: string
  destination?: string
  accompanyingAdult?: string
  status: string
  expiresAt: string
  createdAt: string
}
```

## 🚀 Implementation Priority (Management App Only)

### Phase 1: Core Infrastructure (Week 1-2)
- [x] Setup authentication system with JWT tokens
- [x] Implement case conversion plugin (camelCase ↔ snake_case)
- [x] Create universal pagination composable
- [x] Setup middleware for route protection
- [x] Implement request forwarding routes

### Phase 2: Management Core Features (Week 3-4)
- [ ] Payment management (bills, transactions, cluster wallet)
- [ ] User & role management with permissions
- [ ] Dashboard with key metrics and statistics
- [ ] Basic navigation and layout structure

### Phase 3: Content Management (Week 5-6)
- [ ] Announcements system with attachments
- [ ] Maintenance logs & scheduling
- [ ] File upload & management system
- [ ] Bulk operations for efficiency

### Phase 4: Operations Management (Week 7-8)
- [ ] Helpdesk system with issue tracking
- [ ] Staff shift management with clock-in/out
- [ ] Emergency management (SOS alerts)
- [ ] Reporting and analytics

### Phase 5: Polish & Optimization (Week 9-10)
- [ ] Error handling & user feedback
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Testing & bug fixes

## 🔧 Development Guidelines

### Code Standards
- **Use camelCase consistently** - the case conversion plugin handles Django's snake_case
- **TypeScript everywhere** - all composables, components, and types
- **Vue 3 Composition API** - modern, reactive patterns
- **Proper error handling** - user-friendly messages
- **Loading states** - for all async operations

### File Naming Conventions
- **Components**: PascalCase (e.g., `DataTable.vue`, `PaymentForm.vue`)
- **Composables**: camelCase with "use" prefix (e.g., `usePayments.ts`, `useMaintenance.ts`)
- **Pages**: kebab-case (e.g., `scheduled-payments.vue`, `user-management.vue`)
- **Types**: PascalCase interfaces (e.g., `interface Bill {}`, `interface User {}`)

### API Integration Rules
1. **Always use consistent camelCase** - let the plugin handle conversion
2. **Handle loading states** in all components
3. **Implement proper error boundaries** with try/catch blocks
4. **Cache frequently accessed data** with `useLazyAsyncData`
5. **Use server-side rendering** for initial page loads

### Case Conversion Guidelines
```typescript
// ✅ Good - Frontend uses camelCase consistently
const billData = {
  billNumber: "BILL-001",
  dueDate: "2025-12-31",
  createdBy: "admin",
  isOverdue: false
}

// ❌ Bad - Don't use snake_case in frontend
const billData = {
  bill_number: "BILL-001",    // Wrong!
  due_date: "2025-12-31",     // Wrong!
  created_by: "admin",        // Wrong!
  is_overdue: false           // Wrong!
}

// ✅ Good - TypeScript interfaces use camelCase
interface Bill {
  billNumber: string      // Plugin converts to bill_number for Django
  dueDate: string        // Plugin converts to due_date for Django
  isOverdue: boolean     // Plugin converts to is_overdue for Django
}
```

### Security Considerations
- **Never expose sensitive data** in client-side code
- **Use httpOnly cookies** for token storage
- **Implement proper CSRF protection**
- **Validate all user inputs** before API calls
- **Use role-based access control** consistently

## 📋 Implementation Checklist

### Core Infrastructure ✅
- [x] Authentication system with JWT token management
- [x] Case conversion plugin for camelCase ↔ snake_case
- [x] Request forwarding to Django backend
- [x] Middleware for route protection
- [x] Universal pagination composable (partial)

### Management Features
- [ ] **Payment Management**
  - [ ] Bills CRUD operations
  - [ ] Bulk bill creation
  - [ ] Payment dashboard
  - [ ] Cluster wallet management
  
- [ ] **User Management**
  - [ ] User listing and filtering
  - [ ] Role assignment
  - [ ] Staff management
  - [ ] Permission controls

- [ ] **Content Management**
  - [ ] Announcements system
  - [ ] File upload handling
  - [ ] Maintenance logging
  - [ ] Schedule management

- [ ] **Operations**
  - [ ] Helpdesk ticketing
  - [ ] Emergency alerts
  - [ ] Shift management
  - [ ] Reporting system

### Data Management
- [ ] Server-side data fetching strategy
- [ ] Client-side caching with `useLazyAsyncData`
- [ ] Infinite loading implementation
- [ ] Data filtering and search
- [ ] Real-time updates where needed

### UI/UX Polish
- [ ] Responsive design for mobile/tablet
- [ ] Loading states for all async operations
- [ ] Error boundaries and user feedback
- [ ] Accessibility compliance
- [ ] Performance optimization

---

This architecture provides a **management-focused** foundation for the ClustR frontend application with proper authentication, consistent camelCase usage, and modular organization based on the Django API specification.

## 🚧 PENDING TASKS - Implementation Session September 13, 2025

### Immediate Next Steps
- [ ] **Complete DataTable Integration**
  - [ ] Refactor existing `components/shared/DataTable.vue` to integrate with `usePagination` composable
  - [ ] Support both server-side and client-side pagination modes
  - [ ] Add infinite scroll mode support
  - [ ] Maintain existing component API for backwards compatibility
  <!-- - [ ] Test with InfiniteLoader component integration -->

- [ ] **Install Required Dependencies**
  - [x] Install `lodash-es` package needed for case conversion plugin
  - [x] Update package.json with proper lodash-es version
  - [x] Verify case conversion plugin works correctly

### Core Management Module Implementation
- [ ] **Payment Management Module** 
  - [ ] Create bills CRUD operations in `composables/management/usePayments.ts`
  - [ ] Implement bulk bill creation functionality
  - [ ] Build payment dashboard with statistics
  - [ ] Add cluster wallet management features
  - [ ] Create payment-related pages and components

- [ ] **User Management System**
  - [ ] Implement user listing and filtering
  - [ ] Add role assignment functionality  
  - [ ] Create staff management interface
  - [ ] Build permission control system
  - [ ] Add user management pages and forms

### Additional Features Queue
- [ ] **Content Management**
  - [ ] Announcements system with file attachments
  - [ ] Maintenance logging and scheduling
  - [ ] File upload and management system

- [ ] **Operations Management**
  - [ ] Helpdesk ticketing system
  - [ ] Emergency alerts and SOS handling
  - [ ] Staff shift management with clock-in/out
  - [ ] Reporting and analytics dashboard

### Technical Debt & Polish
- [ ] **Error Handling**
  - [ ] Implement comprehensive error boundaries
  - [ ] Add user-friendly error messages
  - [ ] Create error logging system

- [ ] **Performance Optimization**
  - [ ] Optimize infinite scroll performance
  - [ ] Add proper loading states everywhere
  - [ ] Implement caching strategies

- [ ] **Testing & Quality**
  - [ ] Add unit tests for composables
  - [ ] Create integration tests for API routes
  - [ ] Validate TypeScript types against API

### Session Notes
**Date**: September 13, 2025  
**Status**: Core infrastructure successfully implemented  
**Next Priority**: Complete pagination system and move to management modules  
**Technical Context**: JWT auth working, case conversion ready, server forwarding complete, middleware protection active