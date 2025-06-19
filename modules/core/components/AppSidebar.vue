<template>
  <aside class="w-64 bg-gray-900 text-white h-screen flex flex-col">
    <!-- Logo/Brand -->
    <div class="p-4 border-b border-gray-700">
      <h1 class="text-xl font-bold">{{ config.public.appName }}</h1>
    </div>
    
    <!-- Main Navigation -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-4">
        <div 
          v-for="module in availableModules" 
          :key="module.id"
          class="mb-2"
        >
          <button
            @click="setCurrentModule(module.id)"
            class="w-full flex items-center px-3 py-2 rounded-lg transition-colors"
            :class="[
              currentModule === module.id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            <Icon :name="module.icon" class="w-5 h-5 mr-3" />
            <span>{{ module.label }}</span>
          </button>
          
          <!-- Sub-navigation -->
          <div 
            v-if="currentModule === module.id && subNavigation.length"
            class="ml-8 mt-2 space-y-1"
          >
            <NuxtLink
              v-for="navItem in subNavigation"
              :key="navItem.id"
              :to="navItem.route"
              class="flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-400 hover:bg-gray-700 hover:text-white"
              active-class="bg-gray-700 text-white"
            >
              <Icon :name="navItem.icon" class="w-4 h-4 mr-2" />
              <span>{{ navItem.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <!-- User Info -->
    <div class="p-4 border-t border-gray-700">
      <div v-if="user" class="flex items-center">
        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span class="text-sm font-medium">{{ user.name.charAt(0) }}</span>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">{{ user.name }}</p>
          <p class="text-xs text-gray-400">{{ user.role }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '../runtime/composables/useAuth'
import { usePluginRegistry } from '../runtime/composables/usePluginRegistry'
import { useRuntimeConfig } from '#app'
import Icon from '~~/components/Icon.vue' // Declare the Icon component

const config = useRuntimeConfig()
const { user, availableModules, permissions } = useAuth()
const registry = usePluginRegistry()

const currentModule = ref(null)

// Get sub-navigation for the selected module
const subNavigation = computed(() => {
  if (!currentModule.value) return []
  
  // Execute module-specific extension point to get navigation items
  const navItems = registry.executeExtension(
    `${currentModule.value}:getNavigation`, 
    { permissions: permissions.value }
  )
  
  // Flatten results from all handlers into a single array
  return navItems.flat().sort((a, b) => a.order - b.order)
})

function setCurrentModule(moduleId) {
  currentModule.value = moduleId
}

// Set initial module if available
watch(availableModules, (modules) => {
  if (modules.length && !currentModule.value) {
    currentModule.value = modules[0].id
  }
}, { immediate: true })
</script>
