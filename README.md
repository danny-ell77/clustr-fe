# ClustR Frontend

A modern estate management platform built with Nuxt 3, Vue 3, and TypeScript.

## Overview

ClustR is a comprehensive estate management system that provides tools for property management, shift scheduling, tenant communication, accounting, and security management.

## Tech Stack

- **Framework**: Nuxt 3
- **UI Framework**: Vue 3 with Composition API
- **Styling**: Tailwind CSS + shadcn-vue components
- **State Management**: TanStack Query (Vue Query)
- **Type Safety**: TypeScript
- **Icons**: Nuxt Icon

## Project Structure

The project follows standard Nuxt 3 conventions with domain-based organization:

```
clustr-fe/
├── components/          # Vue components organized by domain
│   ├── accounting/     # Accounting & billing components
│   ├── layout/         # Layout components (header, sidebar)
│   ├── portal/         # Tenant portal components
│   ├── property/       # Property management components
│   ├── security/       # Security & access control components
│   ├── shift/          # Shift management components
│   ├── ui/             # Reusable UI components (shadcn-vue)
│   └── ...
├── composables/        # Vue composables organized by domain
│   ├── accounting/     # Accounting composables
│   ├── auth/           # Authentication & permissions
│   ├── portal/         # Portal composables
│   ├── property/       # Property composables
│   ├── shift/          # Shift composables
│   └── ...
├── pages/              # File-based routing
│   ├── accounting/     # Accounting routes
│   ├── portal/         # Portal routes
│   ├── property/       # Property routes
│   ├── security/       # Security routes
│   ├── shift/          # Shift routes
│   └── ...
├── services/           # API service layer
│   └── api/            # Domain-specific API services
├── types/              # TypeScript type definitions
├── middleware/         # Route middleware
├── config/             # Application configuration
└── plugins/            # Nuxt plugins
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will start at `http://localhost:3003`

## Architecture

### Domain Organization

The codebase is organized by business domains:

- **Accounting**: Billing, payments, and financial management
- **Portal**: Tenant communication and announcements
- **Property**: Property and maintenance management
- **Security**: User management and access control
- **Shift**: Staff shift scheduling and management

### Auto-Imports

Nuxt automatically imports:
- Components from `components/`
- Composables from `composables/`
- Utilities from `utils/`

No manual imports needed for these!

### API Services

All API calls are centralized in `services/api/`:

```typescript
// Import from centralized index
import { propertyApi, shiftApi } from '~/services/api'

// Use in composables
const properties = await propertyApi.getAll()
```

### State Management

We use TanStack Query for server state:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['properties'],
  queryFn: () => propertyApi.getAll()
})
```

### Authentication & Permissions

Authentication is handled via composables:

```typescript
const { user, isAuthenticated, hasPermission } = useAuth()
const { hasPermission, PERMISSIONS } = usePermissions()
```

Pages can require permissions via meta:

```typescript
definePageMeta({
  requiresPermission: 'property.overview.view'
})
```

## Development Guidelines

### Adding a New Feature

1. **Create types** in `types/{domain}.ts`
2. **Create API service** in `services/api/{domain}.api.ts`
3. **Create composable** in `composables/{domain}/use{Feature}.ts`
4. **Create components** in `components/{domain}/`
5. **Create pages** in `pages/{domain}/`

### Component Naming

- Use PascalCase for component files
- Domain-specific components go in `components/{domain}/`
- Shared UI components go in `components/ui/`

### Composable Patterns

```typescript
// composables/property/useProperties.ts
export const useProperties = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyApi.getAll()
  })

  return {
    properties: computed(() => data.value),
    loading: isLoading
  }
}
```

### API Service Patterns

```typescript
// services/api/property.api.ts
export const propertyApi = {
  getAll: (params?: PropertyFilters) => 
    apiClient.get('/properties', { params }),
  
  getById: (id: string) => 
    apiClient.get(`/properties/${id}`),
  
  create: (data: CreatePropertyDto) => 
    apiClient.post('/properties', data)
}
```

## Migration Notes

This project was recently refactored from a custom module architecture to standard Nuxt conventions:

### What Changed

- ✅ Removed custom `defineNuxtModule` implementations
- ✅ Moved to standard Nuxt directory structure
- ✅ Simplified component auto-registration
- ✅ Consolidated middleware
- ✅ Centralized API services
- ✅ Configuration-based module registry

### Benefits

- Simpler architecture following Nuxt best practices
- Better auto-import support
- Easier onboarding for new developers
- Reduced boilerplate code
- Improved maintainability

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run postinstall      # Generate Nuxt types
```

## Environment Variables

Create a `.env` file:

```env
API_BASE=http://localhost:8000/api/v1/
JWT_SECRET=your-secret-key
```

## Contributing

1. Follow the domain-based organization
2. Use TypeScript for type safety
3. Write composables for reusable logic
4. Keep components focused and small
5. Use TanStack Query for server state

## License

Proprietary - ClustR Estate Management
