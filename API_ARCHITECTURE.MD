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
- **TanStack Vue Query** for data fetching, caching, and state management
- **Service Layer Pattern** - Plain functions/objects for API calls, separate from query logic
- **Automatic case conversion** (camelCase ↔ snake_case) using lodash

### 2. Authentication & Authorization
- **JWT tokens** with httpOnly cookies
- **Access token**: 15 minutes expiry
- **Refresh token**: 7 days expiry
- **Automatic token refresh** in server routes on 401 errors
- **Role-based permissions** for management features

### 3. Data Loading Strategy
- **TanStack Query manages**: Caching, refetching, loading states, error handling
- **Service layer handles**: Actual HTTP requests using $api plugin
- **Server-side (SSR)**: Initial page data, user profile, critical state
- **Client-side**: Pagination, filtering, real-time updates, user interactions
- **Hierarchical query keys** for smart cache invalidation

### 4. Multi-Tenant Vanity URLs
- **Subdomain routing**: `{cluster-slug}.clustr.com` for branded admin dashboards
- **Public sharing**: Branded links for invoices, bills, receipts, visitor invitations
- **Cluster context**: Automatic cluster detection from subdomain
- **Fallback routing**: Main domain routing for non-cluster URLs
## 📁 Project Structure

```
clustr-fe/
├── services/
│   └── api/                     # API Service Layer (Plain Functions)
│       ├── index.ts             # Export all services
│       ├── payments.service.ts  # Bills, transactions, wallet
│       ├── announcements.service.ts
│       ├── maintenance.service.ts
│       ├── helpdesk.service.ts
│       ├── shifts.service.ts
│       ├── emergency.service.ts
│       ├── users.service.ts
│       └── auth.service.ts
├── constants/
│   └── query-keys.ts            # Centralized query key factory
├── composables/
│   ├── useAuth.ts               # Authentication management
│   └── useCluster.ts            # Cluster/tenant context
├── plugins/
│   ├── api.client.ts            # $api plugin with case conversion
│   └── vue-query.client.ts      # TanStack Query setup
├── middleware/
│   ├── auth.ts                  # Route protection
│   ├── permissions.ts           # Permission checks
│   └── cluster.global.ts        # Cluster context from subdomain
├── server/api/                  # Request forwarding routes
│   ├── auth/[...].ts           # Auth endpoint forwarding
│   ├── management/[...].ts     # Management endpoint forwarding (with auto-refresh)
│   ├── core/[...].ts           # Core utilities forwarding
│   └── public/[...].ts         # Public sharing endpoints
├── types/
│   ├── api.ts                   # API response types
│   ├── auth.ts                  # Auth types
│   ├── management.ts            # Management module types
│   └── cluster.ts               # Cluster/tenant types
└── components/
    ├── shared/
    │   ├── GenericTable.vue     # Universal data table
    │   ├── InfiniteLoader.vue   # Infinite scroll with TanStack Query
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
## 🔄 Case Conversion Plugin (CRITICAL FEATURE)

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
## 🔑 Query Key Management (CRITICAL PATTERN)

### Hierarchical Query Key Factory

Query keys are organized hierarchically like a file system for smart cache invalidation:

```typescript
// constants/query-keys.ts

export const queryKeys = {
  // Bills domain
  bills: {
    all: ['bills'] as const,
    lists: () => [...queryKeys.bills.all, 'list'] as const,
    list: (filters: Record<string, any>) => 
      [...queryKeys.bills.lists(), filters] as const,
    details: () => [...queryKeys.bills.all, 'detail'] as const,
    detail: (id: string) => 
      [...queryKeys.bills.details(), id] as const,
    infinite: (filters: Record<string, any>) => 
      [...queryKeys.bills.all, 'infinite', filters] as const,
    dashboard: () => [...queryKeys.bills.all, 'dashboard'] as const,
  },

  // Payments domain
  payments: {
    all: ['payments'] as const,
    transactions: {
      all: () => [...queryKeys.payments.all, 'transactions'] as const,
      list: (filters: any) => 
        [...queryKeys.payments.transactions.all(), filters] as const,
      detail: (id: string) => 
        [...queryKeys.payments.transactions.all(), id] as const,
    },
    wallet: () => [...queryKeys.payments.all, 'wallet'] as const,
  },

  // Announcements domain
  announcements: {
    all: ['announcements'] as const,
    lists: () => [...queryKeys.announcements.all, 'list'] as const,
    list: (filters: any) => 
      [...queryKeys.announcements.lists(), filters] as const,
    detail: (id: string) => 
      [...queryKeys.announcements.all, 'detail', id] as const,
    published: () => 
      [...queryKeys.announcements.all, 'published'] as const,
  },

  // Maintenance domain
  maintenance: {
    all: ['maintenance'] as const,
    logs: {
      all: () => [...queryKeys.maintenance.all, 'logs'] as const,
      list: (filters: any) => 
        [...queryKeys.maintenance.logs.all(), filters] as const,
      detail: (id: string) => 
        [...queryKeys.maintenance.logs.all(), id] as const,
    },
    schedules: {
      all: () => [...queryKeys.maintenance.all, 'schedules'] as const,
      list: (filters: any) => 
        [...queryKeys.maintenance.schedules.all(), filters] as const,
      upcoming: () => 
        [...queryKeys.maintenance.schedules.all(), 'upcoming'] as const,
    },
    analytics: () => [...queryKeys.maintenance.all, 'analytics'] as const,
  },

  // Helpdesk domain
  helpdesk: {
    all: ['helpdesk'] as const,
    issues: {
      all: () => [...queryKeys.helpdesk.all, 'issues'] as const,
      list: (filters: any) => 
        [...queryKeys.helpdesk.issues.all(), filters] as const,
      detail: (id: string) => 
        [...queryKeys.helpdesk.issues.all(), id] as const,
      statistics: () => 
        [...queryKeys.helpdesk.issues.all(), 'statistics'] as const,
    },
    comments: (issueId: string) => 
      [...queryKeys.helpdesk.all, 'comments', issueId] as const,
  },

  // Shifts domain
  shifts: {
    all: ['shifts'] as const,
    list: (filters: any) => [...queryKeys.shifts.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.shifts.all, 'detail', id] as const,
    statistics: () => [...queryKeys.shifts.all, 'statistics'] as const,
    upcoming: () => [...queryKeys.shifts.all, 'upcoming'] as const,
  },

  // Emergency domain
  emergency: {
    all: ['emergency'] as const,
    alerts: {
      all: () => [...queryKeys.emergency.all, 'alerts'] as const,
      list: (filters: any) => 
        [...queryKeys.emergency.alerts.all(), filters] as const,
      detail: (id: string) => 
        [...queryKeys.emergency.alerts.all(), id] as const,
      active: () => 
        [...queryKeys.emergency.alerts.all(), 'active'] as const,
    },
    contacts: () => [...queryKeys.emergency.all, 'contacts'] as const,
    responses: (alertId: string) => 
      [...queryKeys.emergency.all, 'responses', alertId] as const,
  },

  // Users domain
  users: {
    all: ['users'] as const,
    list: (filters: any) => [...queryKeys.users.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
    roles: () => [...queryKeys.users.all, 'roles'] as const,
    permissions: (userId: string) => 
      [...queryKeys.users.all, 'permissions', userId] as const,
  },

  // Auth domain
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },
} as const
```

### Benefits of Hierarchical Keys

```typescript
// Invalidate ALL bills (lists, details, dashboard, everything)
queryClient.invalidateQueries({ queryKey: queryKeys.bills.all })

// Invalidate only bill lists (all filter combinations)
queryClient.invalidateQueries({ queryKey: queryKeys.bills.lists() })

// Invalidate specific bill
queryClient.invalidateQueries({ queryKey: queryKeys.bills.detail('bill-123') })
```

## 🔌 TanStack Vue Query Setup

### Plugin Configuration

```typescript
// plugins/vue-query.client.ts
import { VueQueryPlugin, QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })

  const options: VueQueryPluginOptions = {
    queryClient,
    enableDevtoolsV6Plugin: true, // Enable devtools
  }

  nuxtApp.vueApp.use(VueQueryPlugin, options)

  return {
    provide: {
      queryClient,
    },
  }
})
```

## 📦 Service Layer Pattern

### API Services (Plain Functions)

Services are plain functions that use the `$api` plugin. They have no knowledge of TanStack Query.

```typescript
// services/api/payments.service.ts
import type { Bill, PaginatedResponse, CreateBillDto } from '~/types/management'

export const paymentsApi = {
  getBills: (params?: Record<string, any>) => {
    const { $api } = useNuxtApp()
    return $api<PaginatedResponse<Bill>>('/management/payments/bills/', {
      method: 'GET',
      query: params
    })
  },
  
  getBillById: (id: string) => {
    const { $api } = useNuxtApp()
    return $api<Bill>(`/management/payments/bills/${id}/`, {
      method: 'GET'
    })
  },
  
  createBill: (data: CreateBillDto) => {
    const { $api } = useNuxtApp()
    return $api<Bill>('/management/payments/create_bill/', {
      method: 'POST',
      body: data
    })
  },
  
  updateBill: (id: string, data: Partial<Bill>) => {
    const { $api } = useNuxtApp()
    return $api<Bill>(`/management/payments/bills/${id}/`, {
      method: 'PATCH',
      body: data
    })
  },
  
  deleteBill: (id: string) => {
    const { $api } = useNuxtApp()
    return $api(`/management/payments/bills/${id}/`, {
      method: 'DELETE'
    })
  },
  
  getPaymentDashboard: () => {
    const { $api } = useNuxtApp()
    return $api('/management/payments/dashboard/')
  },
  
  getClusterWallet: () => {
    const { $api } = useNuxtApp()
    return $api('/management/payments/cluster_wallet/')
  },
}

// services/api/announcements.service.ts
export const announcementsApi = {
  getAnnouncements: (params?: any) => {
    const { $api } = useNuxtApp()
    return $api('/management/announcements/', { method: 'GET', query: params })
  },
  
  getAnnouncementById: (id: string) => {
    const { $api } = useNuxtApp()
    return $api(`/management/announcements/${id}/`, { method: 'GET' })
  },
  
  createAnnouncement: (data: any) => {
    const { $api } = useNuxtApp()
    return $api('/management/announcements/', { method: 'POST', body: data })
  },
  
  publishAnnouncement: (id: string) => {
    const { $api } = useNuxtApp()
    return $api(`/management/announcements/${id}/publish/`, { method: 'POST' })
  },
}

// services/api/maintenance.service.ts
export const maintenanceApi = {
  getLogs: (params?: any) => {
    const { $api } = useNuxtApp()
    return $api('/management/maintenance-logs/', { method: 'GET', query: params })
  },
  
  createLog: (data: any) => {
    const { $api } = useNuxtApp()
    return $api('/management/maintenance-logs/', { method: 'POST', body: data })
  },
  
  updateStatus: (id: string, status: string) => {
    const { $api } = useNuxtApp()
    return $api(`/management/maintenance-logs/${id}/`, { 
      method: 'PATCH', 
      body: { status } 
    })
  },
}

// services/api/index.ts - Export all services
export * from './payments.service'
export * from './announcements.service'
export * from './maintenance.service'
export * from './helpdesk.service'
export * from './shifts.service'
export * from './emergency.service'
export * from './users.service'
export * from './auth.service'
```

## 📊 Data Loading with TanStack Query

### Infinite Loading Component

```vue
<!-- components/shared/InfiniteLoader.vue -->
<template>
  <div>
    <!-- Render all pages -->
    <div v-for="(page, i) in query.data.value?.pages" :key="i">
      <slot :items="page.results" />
    </div>
    
    <!-- Loading more indicator -->
    <div 
      v-if="query.hasNextPage.value" 
      ref="loadMoreTrigger" 
      class="load-more-trigger"
    >
      <div v-if="query.isFetchingNextPage.value" class="loading">
        <Spinner /> Loading more...
      </div>
    </div>
    
    <!-- No more data -->
    <div v-else-if="query.data.value" class="text-center p-4 text-gray-500">
      No more items
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UseInfiniteQueryReturnType } from '@tanstack/vue-query'

interface Props {
  query: UseInfiniteQueryReturnType<any, any>
}

const props = defineProps<Props>()
const loadMoreTrigger = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (
      entries[0].isIntersecting && 
      props.query.hasNextPage.value && 
      !props.query.isFetchingNextPage.value
    ) {
      props.query.fetchNextPage()
    }
  }, { threshold: 0.1 })
  
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
  
  onUnmounted(() => observer.disconnect())
})
</script>
```

## 🎯 Component Usage Patterns

### Basic Query Pattern

```vue
<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { paymentsApi } from '~/services/api'

const queryClient = useQueryClient()
const filters = ref({ type: 'electricity', status: 'pending' })

// ✅ Query with service function
const billsQuery = useQuery({
  queryKey: queryKeys.bills.list(filters.value),
  queryFn: () => paymentsApi.getBills(filters.value)
})

// ✅ Mutation with cache invalidation
const createMutation = useMutation({
  mutationFn: paymentsApi.createBill,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bills.lists() })
  }
})
</script>

<template>
  <div v-if="billsQuery.isLoading.value">Loading...</div>
  <div v-else-if="billsQuery.isError.value">Error: {{ billsQuery.error.value?.message }}</div>
  <div v-else>
    <div v-for="bill in billsQuery.data.value?.results" :key="bill.id">
      {{ bill.title }}
    </div>
  </div>
</template>
```

### Infinite Query Pattern

```vue
<script setup lang="ts">
import { useInfiniteQuery } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { paymentsApi } from '~/services/api'

const filters = ref({ billType: '' })

const billsQuery = useInfiniteQuery({
  queryKey: queryKeys.bills.infinite(filters.value),
  queryFn: ({ pageParam = 1 }) => 
    paymentsApi.getBills({ ...filters.value, page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.next ? lastPage.next : undefined,
  initialPageParam: 1,
})
</script>

<template>
  <InfiniteLoader :query="billsQuery">
    <template #default="{ items }">
      <div v-for="bill in items" :key="bill.id">
        {{ bill.title }}
      </div>
    </template>
  </InfiniteLoader>
</template>
```
<!-- 
### Mutation with Optimistic Updates

```typescript
const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string, data: any }) => 
    paymentsApi.updateBill(id, data),
  onMutate: async (variables) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ 
      queryKey: queryKeys.bills.detail(variables.id) 
    })
    
    // Snapshot previous value
    const previousBill = queryClient.getQueryData(
      queryKeys.bills.detail(variables.id)
    )
    
    // Optimistically update
    queryClient.setQueryData(
      queryKeys.bills.detail(variables.id),
      (old: any) => ({ ...old, ...variables.data })
    )
    
    return { previousBill }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(
      queryKeys.bills.detail(variables.id),
      context?.previousBill
    )
  },
  onSettled: (data, error, variables) => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.bills.detail(variables.id) 
    })
  },
})
``` -->

## 🎨 Page Implementation Examples

### Management Bills Page (with TanStack Query)

```vue
<!-- pages/management/payments/bills.vue -->
<template>
  <div class="bills-management">
    <div class="header">
      <h1>Bills Management</h1>
      <Button 
        @click="showCreateModal = true" 
        :disabled="createMutation.isPending.value"
      >
        {{ createMutation.isPending.value ? 'Creating...' : 'Create Bill' }}
      </Button>
    </div>
    
    <div class="filters">
      <Input v-model="filters.search" placeholder="Search bills..." />
      <Select v-model="filters.billType">
        <option value="All">All Types</option>
        <option value="electricity">Electricity</option>
        <option value="water">Water</option>
      </Select>
    </div>
    
    <!-- Loading State -->
    <div v-if="billsQuery.isLoading.value" class="loading">
      <Spinner /> Loading bills...
    </div>
    
    <!-- Error State -->
    <div v-else-if="billsQuery.isError.value" class="error">
      Error: {{ billsQuery.error.value?.message }}
      <Button @click="billsQuery.refetch()">Retry</Button>
    </div>
    
    <!-- Data Table -->
    <GenericTable 
      v-else
      :data="billsQuery.data.value?.results || []" 
      :columns="columns" 
      :actions="tableActions"
    />
    
    <!-- Create Bill Modal -->
    <BillFormModal 
      v-model:open="showCreateModal"
      @submit="handleCreateBill"
      :loading="createMutation.isPending.value"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { paymentsApi } from '~/services/api'

definePageMeta({
  title: 'Bills Management',
  middleware: ['auth', 'permissions']
})

const queryClient = useQueryClient()
const filters = ref({ search: '', billType: '' })
const showCreateModal = ref(false)

// ✅ Query with reactive filters
const billsQuery = useQuery({
  queryKey: queryKeys.bills.list(filters.value),
  queryFn: () => paymentsApi.getBills(filters.value)
})

// ✅ Create mutation
const createMutation = useMutation({
  mutationFn: paymentsApi.createBill,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bills.lists() })
    showCreateModal.value = false
  }
})

// ✅ Delete mutation
const deleteMutation = useMutation({
  mutationFn: paymentsApi.deleteBill,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bills.lists() })
  }
})

const handleCreateBill = (data: any) => {
  createMutation.mutate(data)
}

const handleDeleteBill = (billId: string) => {
  if (confirm('Are you sure?')) {
    deleteMutation.mutate(billId)
  }
}

const columns = [
  { key: 'billNumber', label: 'Bill #' },
  { key: 'title', label: 'Title' },
  { key: 'amount', label: 'Amount' },
  { key: 'dueDate', label: 'Due Date' },
]

const tableActions = [
  { label: 'View', action: (bill) => navigateTo(`/management/payments/bills/${bill.id}`) },
  { label: 'Delete', action: (bill) => handleDeleteBill(bill.id) }
]
</script>
```

### Infinite Scroll Bills Page

```vue
<!-- pages/management/payments/bills-infinite.vue -->
<template>
  <div class="bills-infinite">
    <h1>Bills (Infinite Scroll)</h1>
    
    <div v-if="billsQuery.isLoading.value">Loading...</div>
    
    <InfiniteLoader v-else :query="billsQuery">
      <template #default="{ items }">
        <div v-for="bill in items" :key="bill.id" class="bill-card">
          <h3>{{ bill.title }}</h3>
          <p>{{ bill.amount }}</p>
        </div>
      </template>
    </InfiniteLoader>
  </div>
</template>

<script setup lang="ts">
import { useInfiniteQuery } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { paymentsApi } from '~/services/api'

const filters = ref({ billType: 'electricity' })

const billsQuery = useInfiniteQuery({
  queryKey: queryKeys.bills.infinite(filters.value),
  queryFn: ({ pageParam = 1 }) => 
    paymentsApi.getBills({ ...filters.value, page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.next ? lastPage.next : undefined,
  initialPageParam: 1,
})
</script>
```

### Management Dashboard

```vue
<!-- pages/dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="welcome">
      <h1>Management Dashboard</h1>
      <p>Welcome back, {{ user?.name }}</p>
    </div>
    
    <div v-if="dashboardQuery.isLoading.value">Loading stats...</div>
    
    <div v-else-if="dashboardQuery.data.value" class="quick-stats">
      <StatsCard 
        title="Total Bills" 
        :value="dashboardQuery.data.value.totalBills" 
      />
      <StatsCard 
        title="Pending Payments" 
        :value="dashboardQuery.data.value.pendingPayments" 
      />
      <StatsCard 
        title="Active Users" 
        :value="dashboardQuery.data.value.activeUsers" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { paymentsApi } from '~/services/api'

definePageMeta({
  title: 'Management Dashboard',
  middleware: 'auth'
})

const { user } = useAuth()

const dashboardQuery = useQuery({
  queryKey: queryKeys.bills.dashboard(),
  queryFn: paymentsApi.getPaymentDashboard,
  staleTime: 1000 * 60 * 2, // 2 minutes
})
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
- **Components**: PascalCase (e.g., `GenericTable.vue`, `PaymentForm.vue`)
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
- [x] Server-side data fetching strategy
- [x] Client-side caching with `useLazyAsyncData`
- [x] Infinite loading implementation
- [x] Data filtering and search
- [x] Real-time updates where needed

### UI/UX Polish
- [ ] Responsive design for mobile/tablet
- [ ] Loading states for all async operations
- [ ] Error boundaries and user feedback
- [ ] Accessibility compliance
- [ ] Performance optimization

---

This architecture provides a **management-focused** foundation for the ClustR frontend application with proper authentication, consistent camelCase usage, and modular organization based on the Django API specification.

## 🚧 PENDING TASKS - Implementation Session November 13, 2025

### Immediate Next Steps
- [ ] **Install TanStack Vue Query**
  - [ ] Run: `npm install @tanstack/vue-query` or `bun add @tanstack/vue-query`
  - [ ] Create `plugins/vue-query.client.ts` plugin
  - [ ] Verify devtools are working

- [ ] **Create Query Keys Factory**
  - [ ] Create `constants/query-keys.ts` with hierarchical structure
  - [ ] Define keys for all domains (bills, payments, announcements, etc.)
  - [ ] Export typed query key factory

- [ ] **Create Service Layer**
  - [ ] Create `services/api/` directory
  - [ ] Implement `payments.service.ts` (start here)
  - [ ] Implement other service files (announcements, maintenance, etc.)
  - [ ] Create `services/api/index.ts` barrel export

- [ ] **Refactor Existing Composables**
  - [ ] Check if `composables/useClusterSignup.ts` needs refactoring
  - [ ] Remove any old composables that duplicate service layer
  - [ ] Keep only `useAuth.ts` and `useCluster.ts` as utility composables

### Core Management Module Implementation
- [ ] **Payment Management Module** 
  - [ ] Create `services/api/payments.service.ts` with all API methods
  - [ ] Build bills listing page with TanStack Query
  - [ ] Implement bill creation with mutations
  - [ ] Add payment dashboard with statistics
  - [ ] Implement cluster wallet management

- [ ] **User Management System**
  - [ ] Create `services/api/users.service.ts`
  - [ ] Implement user listing with filtering
  - [ ] Add role assignment functionality  
  - [ ] Create staff management interface
  - [ ] Build permission control system

### Component Updates
- [ ] **Update InfiniteLoader Component**
  - [ ] Refactor to accept `UseInfiniteQueryReturnType` prop
  - [ ] Remove old pagination logic
  - [ ] Test with bills infinite scroll

- [ ] **Update GenericTable Component**
  - [ ] Make it work with TanStack Query loading states
  - [ ] Support both regular and infinite query data
  - [ ] Maintain backwards compatibility if needed

### Additional Features Queue
- [ ] **Content Management**
  - [ ] Create `services/api/announcements.service.ts`
  - [ ] Create `services/api/maintenance.service.ts`
  - [ ] Implement file upload service

- [ ] **Operations Management**
  - [ ] Create `services/api/helpdesk.service.ts`
  - [ ] Create `services/api/emergency.service.ts`
  - [ ] Create `services/api/shifts.service.ts`

### Technical Debt & Polish
- [ ] **Error Handling**
  - [ ] Add global error handler for TanStack Query
  - [ ] Implement toast notifications for errors
  - [ ] Create error logging system

- [ ] **Performance Optimization**
  - [ ] Configure appropriate staleTime for different queries
  - [ ] Implement prefetching for common navigation paths
  - [ ] Add optimistic updates for mutations

- [ ] **Testing & Quality**
  - [ ] Add unit tests for service functions
  - [ ] Test query key invalidation patterns
  - [ ] Validate TypeScript types against API

### Architecture Notes
**Date**: November 13, 2025  
**Status**: Architecture revised with TanStack Query + Service Layer pattern  
**Key Decisions**:
- ✅ No custom abstraction over useQuery/useMutation
- ✅ Service layer with plain functions (not classes)
- ✅ Hierarchical query keys for smart invalidation
- ✅ TanStack Query as cache manager, not data fetcher
- ✅ Keep $api plugin for case conversion and auth

**Existing Code to Refactor**:
- `composables/useClusterSignup.ts` - ✅ Keep as-is (utility composable for multi-step form state)
- `composables/usePagination.ts` - ❌ Remove (replaced by TanStack Query's useInfiniteQuery)
- `composables/useUserManagement.ts` - ❌ Refactor to `services/api/users.service.ts`
- `composables/useWallet.ts` - ❌ Refactor to `services/api/wallet.service.ts` + TanStack Query
- `composables/useDataManager.ts` - Need to review
- `composables/usePermissions.ts` - ✅ Keep as-is (utility composable)
- `composables/useToast.js` - ✅ Keep as-is (UI utility)
- `composables/useSuccessModal.js` - ✅ Keep as-is (UI utility)
- `composables/useFormatters.js` - ✅ Keep as-is (utility functions)
- `composables/useFieldValidation.ts` - ✅ Keep as-is (form utility)
- `composables/useDataFilters.ts` - Need to review

**Next Priority**: Install TanStack Query, create query keys, build first service (payments), refactor useUserManagement and useWallet