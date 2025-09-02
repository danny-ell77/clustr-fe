"use client"

import { computed } from "vue"
import { useRoute } from "#app"
import { useAuth } from "./useAuth" // Assuming useAuth is in the same directory

interface PageMeta {
  title: string
  description: string
}

// Define a mapping for page metadata
const pageMetaMap: Record<string, PageMeta> = {
  "/": {
    title: "Dashboard",
    description: "Main dashboard overview",
  },
  "/property": {
    title: "Property Dashboard",
    description: "Overview of your property portfolio",
  },
  "/property/listings": {
    title: "Property Listings",
    description: "Manage your property portfolio",
  },
  "/property/maintenance": {
    title: "Property Maintenance",
    description: "Track maintenance requests and schedules",
  },
  "/property/tenants": {
    title: "Property Tenants",
    description: "Manage tenant information and leases",
  },
  "/accounting": {
    title: "Accounting Module",
    description: "Manage financial operations",
  },
  "/accounting/invoices": {
    title: "Invoices",
    description: "Manage invoices and billing",
  },
  "/accounting/payments": {
    title: "Payments",
    description: "Track incoming and outgoing payments",
  },
  "/accounting/reports": {
    title: "Financial Reports",
    description: "Generate financial reports",
  },
  "/security": {
    title: "Access Control Module",
    description: "Manage users, roles, and permissions",
  },
  "/security/users": {
    title: "Users",
    description: "Manage system users and their access",
  },
  "/security/roles": {
    title: "Roles & Permissions",
    description: "Configure roles and permissions",
  },
  "/shift": {
    title: "Shift Management Module",
    description: "Manage shifts and schedules",
  },
  "/shift/scheduling": {
    title: "Shift Scheduling",
    description: "Plan and manage employee shifts and schedules",
  },
  "/shift/logging": {
    title: "Time Logging",
    description: "Track employee work hours",
  },
  "/portal": {
    title: "Tenant Portal Module",
    description: "Communication and resources for tenants",
  },
  "/portal/chat": {
    title: "Tenant Chat",
    description: "Communicate directly with tenants",
  },
  "/portal/meetings": {
    title: "Tenant Meetings",
    description: "Schedule and manage meetings with tenants",
  },
  "/settings": {
    // New settings page
    title: "Settings",
    description: "Manage your application settings",
  },
  // Add more mappings as needed for other pages
}

export function usePageMeta() {
  const route = useRoute()
  const { availableModules } = useAuth()

  const currentPageMeta = computed<PageMeta>(() => {
    const path = route.path
    let meta = pageMetaMap[path]

    // Special prefixes
    if (!meta && path.startsWith('/accounting/reports/')) {
      meta = { title: 'Report Details', description: 'View and update report details' }
    }

    // If a specific path meta is not found, try to derive from module
    if (!meta) {
      const pathSegments = path.split("/").filter(Boolean)
      if (pathSegments.length > 0) {
        const moduleFromPath = pathSegments[0]
        const module = availableModules.value.find((m) => m.id === moduleFromPath)
        if (module) {
          // Fallback to module's general overview meta if specific page not found
          meta = pageMetaMap[`/${module.id}`] || {
            title: module.label,
            description: `Manage ${module.label.toLowerCase()}`,
          }
        }
      }
    }

    // Fallback for unknown routes
    return (
      meta || {
        title: "Page Not Found",
        description: "The page you are looking for does not exist.",
      }
    )
  })

  return {
    pageTitle: computed(() => currentPageMeta.value.title),
    pageDescription: computed(() => currentPageMeta.value.description),
  }
}
