<template>
  <div class="flex h-screen">
    <!-- Primary Sidebar - Only for Admin users -->
    <aside
      class="fixed left-0 top-0 h-full bg-slate-800 text-white flex flex-col items-start py-4 space-y-6 transition-all duration-300 z-30 max-h-screen"
      :class="isSidebarHovered ? 'w-56 shadow-xl' : 'w-16'" @mouseenter="isSidebarHovered = true"
      @mouseleave="isSidebarHovered = false">
      <!-- Logo -->
      <div class="w-10 h-10 rounded-lg flex items-center justify-center ml-3">
        <img src="/images/clustr_logo.png" alt="ClustR Logo" class="w-full h-full object-contain" />
      </div>

      <!-- Primary Navigation Icons + Labels -->
      <nav class="flex flex-col space-y-4 w-full p-2 flex-1">
        <Button v-for="module in availableModules" :key="module.id" :as="NuxtLink" :to="`/${module.id}`"
          @click="setCurrentModule(module.id)" variant="ghost" size="icon"
          class="w-full h-10 rounded-lg transition-colors flex items-center mx-auto p-2" :class="[
            currentModule === module.id
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'text-gray-400 hover:bg-slate-700 hover:text-white',
            isSidebarHovered && 'justify-start'
          ]" :title="module.label">
          <Icon :name="module.icon" class="w-5 h-5" />
          <span class="ml-4 text-base font-medium transition-opacity duration-1000" v-if="isSidebarHovered">
            {{ module.label }}
          </span>
        </Button>
      </nav>

      <!-- Settings Button at the bottom of the main sidebar -->
      <div class="w-full p-2">
        <Button :as="NuxtLink" to="/settings" variant="ghost" size="icon"
          class="w-full h-10 rounded-lg transition-colors flex items-center mx-auto p-2" :class="[
            $route.path === '/settings'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'text-gray-400 hover:bg-slate-700 hover:text-white',
            isSidebarHovered && 'justify-start'
          ]" title="Settings">
          <Icon name="settings" class="w-5 h-5" />
          <span class="ml-4 text-base font-medium transition-opacity duration-200" v-if="isSidebarHovered">
            Settings
          </span>
        </Button>
      </div>
    </aside>

    <!-- Main Content Container with left margin for primary sidebar -->
    <div class="flex flex-1" :class="isAdmin ? 'ml-16' : ''">
      <!-- Secondary Sidebar - For all users -->
      <aside class="bg-slate-100 border-r border-border flex flex-col" :class="isAdmin ? 'w-64' : 'w-80'">
        <!-- Module Header -->
        <div class="p-6 border-b border-border">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="building" class="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 class="text-lg font-semibold text-foreground">{{ appName }}</h1>
              <p class="text-sm text-muted-foreground">{{ getCurrentModuleLabel() }}</p>
            </div>
          </div>
        </div>

        <!-- Secondary Navigation -->
        <nav class="flex-1 p-4 space-y-2">
          <div v-for="navItem in subNavigation" :key="navItem.id" class="group">
            <Button :as="NuxtLink" :to="navItem.route" variant="ghost"
              class="w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg transition-colors" :class="[
                $route.path === navItem.route
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-foreground hover:bg-gray-200 hover:text-foreground'
              ]">
              <Icon :name="navItem.icon" class="w-4 h-4 mr-3" />
              <span>{{ navItem.label }}</span>
            </Button>
          </div>
        </nav>

        <!-- User Info -->
        <div class="p-4 border-t border-border">
          <div v-if="user" class="flex items-center space-x-3">
            <Avatar class="w-8 h-8">
              <AvatarFallback class="bg-blue-600 text-white text-sm font-medium">
                {{ user.name.charAt(0) }}
              </AvatarFallback>
            </Avatar>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{{ user.name }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ user.role }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1">
        <!-- Your main content goes here -->
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, navigateTo, useRuntimeConfig } from '#app'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import Icon from '~/components/Icon.vue'
import { NuxtLink } from '#components'

const route = useRoute()
const { user, permissions, isAdmin, availableModules } = useAuth();
const config = useRuntimeConfig() // Get runtime config
const appName = config.public.appName // Access appName

const currentModule = ref('property')
const isSidebarHovered = ref(false)

// Use availableModules for navigation
const adminModules = availableModules

// Get sub-navigation based on current module and user permissions
const subNavigation = computed(() => {
  const moduleNavs = {
    property: [
      { id: 'overview', label: 'Overview', icon: 'home', route: '/property', order: 1 },
      { id: 'listings', label: 'Listings', icon: 'building', route: '/property/listings', order: 2 },
      { id: 'maintenance', label: 'Maintenance', icon: 'wrench', route: '/property/maintenance', order: 3 },
      { id: 'tenants', label: 'Tenants', icon: 'users', route: '/property/tenants', order: 4 },
    ],
    accounting: [
      { id: 'overview', label: 'Overview', icon: 'layout-dashboard', route: '/accounting', order: 1 },
      { id: 'bills', label: 'Bills', icon: 'file-text', route: '/accounting/bills', order: 2 },
      { id: 'payments', label: 'Payments', icon: 'smartphone', route: '/accounting/payments', order: 3 },
      { id: 'e-wallet', label: 'Wallet', icon: 'credit-card', route: '/accounting/e-wallet', order: 4 },
    ],
    security: [
      { id: 'overview', label: 'Overview', icon: 'shield', route: '/security', order: 1 },
      { id: 'users', label: 'Users', icon: 'users', route: '/security/users', order: 2 },
      { id: 'roles', label: 'Roles', icon: 'user-check', route: '/security/roles', order: 3 },
    ],
    shift: [
      { id: 'overview', label: 'Overview', icon: 'calendar-clock', route: '/shift', order: 1 },
      { id: 'shifts', label: 'Shifts', icon: 'calendar', route: '/shift/shifts', order: 2 },
      { id: 'scheduling', label: 'Scheduling', icon: 'calendar-days', route: '/shift/scheduling', order: 3 },
      { id: 'logging', label: 'Logging', icon: 'clock', route: '/shift/logging', order: 4 },
    ],
    portal: [
      { id: 'overview', label: 'Overview', icon: 'message-circle', route: '/portal', order: 1 },
      { id: 'announcements', label: 'Announcements', icon: 'bell', route: '/portal/announcements', order: 2 },
      { id: 'helpdesk', label: 'Helpdesk', icon: 'headphones', route: '/portal/helpdesk', order: 3 },
      { id: 'chat', label: 'Chat', icon: 'message-square', route: '/portal/chat', order: 4 },
      { id: 'meetings', label: 'Meetings', icon: 'video', route: '/portal/meetings', order: 5 },
      { id: 'reports', label: 'Reports', icon: 'file-text', route: '/portal/reports', order: 6 },
      { id: 'polls', label: 'Polls', icon: 'bar-chart', route: '/portal/polls', order: 7 },
      { id: 'rulebook', label: 'Rule book', icon: 'book', route: '/portal/rulebook', order: 8 },
      { id: 'handymen', label: 'Handy Man Services', icon: 'tool', route: '/portal/handymen', order: 9 }
    ],
    security: [
      { id: 'overview', label: 'Overview', icon: 'key', route: '/security', order: 1 },
      { id: 'logs', label: 'Visitor Logs', icon: 'file-text', route: '/security/logs', order: 3 },
      { id: 'verify', label: 'Verify Visitor', icon: 'check-circle', route: '/security/verify', order: 2 },
      { id: 'requests', label: 'Request Entry', icon: 'alert-circle', route: '/security/requests', order: 4 },
      { id: 'child', label: 'Child Access', icon: 'user-plus', route: '/security/child_access', order: 5 }
    ],
  }

  const navItems = moduleNavs[currentModule.value] || []

  // Filter based on permissions for non-admin users
  if (!isAdmin.value) {
    return navItems.filter(item => {
      const permission = `${currentModule.value}.${item.id}.view`
      return permissions.includes(permission)
    })
  }

  return navItems
})

function setCurrentModule(moduleId) {
  currentModule.value = moduleId
  // Get the first available submenu route for the module
  const moduleNavs = subNavigation.value
  if (moduleNavs && moduleNavs.length > 0) {
    navigateTo(moduleNavs[0].route)
  } else {
    // Fallback to module root if no submenus
    navigateTo(`/${moduleId}`)
  }
}

function getCurrentModuleLabel() {
  const module = adminModules.value.find(m => m.id === currentModule.value)
  return module?.label || 'Dashboard'
}

// Auto-select module based on current route
watch(() => route.path, (newPath) => {
  const pathSegments = newPath.split('/').filter(Boolean)
  const availableModuleIds = adminModules.value.map(m => m.id)
  if (pathSegments.length > 0) {
    const moduleFromPath = pathSegments[0]
    if (availableModuleIds.includes(moduleFromPath)) {
      currentModule.value = moduleFromPath
      return
    }
  }
  // If on root ("/"), set to first available module
  if (newPath === '/' && availableModuleIds.length > 0) {
    currentModule.value = availableModuleIds[0]
  }
}, { immediate: true })

// Ensure hooks are called at the top level
const isAdminRef = ref(isAdmin)
const isSidebarHoveredRef = ref(isSidebarHovered)
</script>
