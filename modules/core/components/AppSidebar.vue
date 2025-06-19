<template>
  <div class="flex h-screen">
    <!-- Primary Sidebar - Only show for admin or users with multiple roles -->
    <aside 
      class="w-16 bg-slate-800 text-white flex flex-col items-center py-4 space-y-6"
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
    
    <!-- Secondary Sidebar - Always show when a module is selected -->
    <aside 
      class="bg-slate-100 border-r border-gray-200 flex flex-col"
      :class="shouldShowPrimarySidebar ? 'w-64' : 'w-80'"
      v-if="currentModule"
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
import { usePluginRegistry } from '../runtime/composables/usePluginRegistry'
import { useRoute } from '#app'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NuxtLink } from '#components'

const route = useRoute()
const { user, availableModules, permissions, shouldShowPrimarySidebar } = useAuth()
const registry = usePluginRegistry()

const currentModule = ref(null)

// Get sub-navigation for the selected module
const subNavigation = computed(() => {
  if (!currentModule.value) return []
  
  const navItems = registry.executeExtension(
    `${currentModule.value}:getNavigation`, 
    { permissions: permissions.value }
  )
  
  return navItems.flat().sort((a, b) => a.order - b.order)
})

function setCurrentModule(moduleId) {
  currentModule.value = moduleId
}

function getCurrentModuleLabel() {
  const module = availableModules.value.find(m => m.id === currentModule.value)
  return module?.label || ''
}

// Auto-select module based on current route
watch(() => route.path, (newPath) => {
  const pathSegments = newPath.split('/').filter(Boolean)
  if (pathSegments.length > 0) {
    const moduleFromPath = pathSegments[0]
    const availableModuleIds = availableModules.value.map(m => m.id)
    if (availableModuleIds.includes(moduleFromPath)) {
      currentModule.value = moduleFromPath
    }
  }
}, { immediate: true })

// Set initial module if available and none selected
watch(availableModules, (modules) => {
  if (modules.length && !currentModule.value) {
    currentModule.value = modules[0].id
  }
}, { immediate: true })
</script>
