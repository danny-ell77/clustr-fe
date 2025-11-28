<template>
  <header class="bg-white shadow-sm border-b border-border">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <!-- Breadcrumb Navigation -->
          <nav class="flex items-center space-x-2 text-sm mb-1">
            <template v-for="(crumb, index) in breadcrumbs" :key="index">
              <NuxtLink v-if="crumb.path" :to="crumb.path" class="text-muted-foreground hover:text-foreground">
                {{ crumb.name }}
              </NuxtLink>
              <span v-else class="text-foreground font-medium">
                {{ crumb.name }}
              </span>
              <Icon v-if="index < breadcrumbs.length - 1" name="chevron-right" class="w-4 h-4 text-gray-400" />
            </template>
          </nav>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Emergency Siren Indicator -->
          <!-- <EmergencySirenIndicator /> -->

          <!-- Notifications -->
          <NotificationsDropdown />

          <!-- User Menu -->
          <DropdownMenu>
            <DropdownMenuTrigger :as-child="true">
              <Button variant="ghost" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar class="w-8 h-8">
                  <AvatarFallback class="bg-primary text-white text-sm font-medium">
                    {{ user?.name.charAt(0) }}
                  </AvatarFallback>
                </Avatar>
                <Icon name="chevron-down" class="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-48" align="end">
              <DropdownMenuItem>
                <!-- <Icon name="user" class="w-4 h-4 mr-2" /> -->
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <!-- <Icon name="settings" class="w-4 h-4 mr-2" /> -->
                Preferences
              </DropdownMenuItem>
              <Separator class="my-1" />
              <DropdownMenuItem @click="handleLogout">
                <!-- <Icon name="log-out" class="w-4 h-4 mr-2" /> -->
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, navigateTo, useRuntimeConfig } from '#app'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import Icon from '~/components/Icon.vue'
// import NotificationsDropdown from '~/modules/core/components/NotificationsDropdown.vue'
import EmergencySirenIndicator from '~/components/EmergencySirenIndicator.vue'

const route = useRoute()
const config = useRuntimeConfig()
const { user, logout } = useAuth()

const pageTitle = computed(() => route.meta.title || 'Dashboard')
const pageDescription = computed(() => route.meta.description || '')

interface Breadcrumb {
  name: string;
  path: string | null;
}

// Generate breadcrumbs based on current route
const breadcrumbs = computed<Breadcrumb[]>(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const crumbs: Breadcrumb[] = []

  // Add root
  if (pathSegments.length > 0) {
    crumbs.push({
      name: pageTitle.value || 'Dashboard',
      path: '/'
    })
  }

  // Build breadcrumb path
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Skip adding duplicate entries
    if (index === crumbs.length - 1 && crumbs[index]?.name.toLowerCase() === segment) {
      return
    }

    // Format segment name
    const name = formatBreadcrumbName(segment)

    // Last segment doesn't get a path (current page)
    crumbs.push({
      name,
      path: index < pathSegments.length - 1 ? currentPath : null
    })
  })

  return crumbs
})

// Helper to format breadcrumb segment names
function formatBreadcrumbName(segment: string): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
    'e-wallet': 'E-Wallet',
  }

  if (segment in specialCases) {
    return specialCases[segment]
  }

  // Capitalize first letter and replace hyphens with spaces
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

async function handleLogout() {
  await logout()
  await navigateTo('/login')
}
</script>
