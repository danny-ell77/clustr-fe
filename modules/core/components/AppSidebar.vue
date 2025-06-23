<template>
  <div class="flex h-screen">
    <!-- Primary Sidebar - Only for Admin users -->
    <aside 
      class="w-16 bg-slate-800 text-white flex flex-col items-center py-4 space-y-6"
      v-if="isAdmin"
    >
      <!-- Logo -->
      <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
        <Icon name="building" class="w-6 h-6 text-white" />
      </div>
      
      <!-- Primary Navigation Icons -->
      <nav class="flex flex-col space-y-4">
        <Button
          v-for="module in availableModules"
          :key="module.id"
          :as="NuxtLink"
          :to="module.id"
          @click="setCurrentModule(module.id)"
          variant="ghost"
          size="icon"
          class="w-10 h-10 rounded-lg transition-colors"
          :class="[
            currentModule === module.id 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'text-gray-400 hover:bg-slate-700 hover:text-white'
          ]"
          :title="module.label"
        >
          <Icon :name="module.icon" class="w-5 h-5" />
        </Button>
      </nav>
    </aside>
    
    <!-- Secondary Sidebar - For all users -->
    <aside 
      class="bg-slate-100 border-r border-gray-200 flex flex-col"
      :class="isAdmin ? 'w-64' : 'w-80'"
    >
      <!-- Module Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Icon name="building" class="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-900">ClustR</h1>
            <p class="text-sm text-gray-500">{{ getCurrentModuleLabel() }}</p>
          </div>
        </div>
      </div>
      
      <!-- Secondary Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <div
          v-for="navItem in subNavigation"
          :key="navItem.id"
          class="group"
        >
          <Button
            :as="NuxtLink"
            :to="navItem.route"
            variant="ghost"
            class="w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="[
              $route.path === navItem.route
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            ]"
          >
            <Icon :name="navItem.icon" class="w-4 h-4 mr-3" />
            <span>{{ navItem.label }}</span>
          </Button>
        </div>
      </nav>
      
      <!-- User Info -->
      <div class="p-4 border-t border-gray-200">
        <div v-if="user" class="flex items-center space-x-3">
          <Avatar class="w-8 h-8">
            <AvatarFallback class="bg-blue-600 text-white text-sm font-medium">
              {{ user.name.charAt(0) }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ user.role }}</p>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '../runtime/composables/useAuth'
import { useRoute } from '#app'
import Button from '~/components/ui/button'
import Avatar from '~/components/ui/avatar'
import AvatarFallback from '~/components/ui/avatar-fallback'

import { NuxtLink } from '#components'

const route = useRoute()
const { user, permissions, isAdmin, availableModules } = useAuth();

const currentModule = ref('property')

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
      { id: 'overview', label: 'Overview', icon: 'dollar-sign', route: '/accounting', order: 1 },
      { id: 'invoices', label: 'Invoices', icon: 'file-text', route: '/accounting/invoices', order: 2 },
      { id: 'payments', label: 'Payments', icon: 'credit-card', route: '/accounting/payments', order: 3 },
      { id: 'reports', label: 'Reports', icon: 'bar-chart', route: '/accounting/reports', order: 4 },
    ],
    security: [
      { id: 'overview', label: 'Overview', icon: 'shield', route: '/security', order: 1 },
      { id: 'users', label: 'Users', icon: 'users', route: '/security/users', order: 2 },
      { id: 'roles', label: 'Roles', icon: 'user-check', route: '/security/roles', order: 3 },
    ],
    shift: [
      { id: 'overview', label: 'Overview', icon: 'calendar-clock', route: '/shift', order: 1 },
      { id: 'scheduling', label: 'Scheduling', icon: 'calendar', route: '/shift/scheduling', order: 2 },
      { id: 'logging', label: 'Logging', icon: 'clock', route: '/shift/logging', order: 3 },
    ],
    portal: [
      { id: 'overview', label: 'Overview', icon: 'message-circle', route: '/portal', order: 1 },
      { id: 'chat', label: 'Chat', icon: 'message-square', route: '/portal/chat', order: 2 },
      { id: 'meetings', label: 'Meetings', icon: 'video', route: '/portal/meetings', order: 3 },
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
  if (availableModuleIds.length > 0) {
    currentModule.value = availableModuleIds[0]
  }
}, { immediate: true })
</script>
