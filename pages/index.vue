<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-2">Welcome to your property management system</p>
    </div>
    
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Icon name="building" class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Available Modules</p>
            <p class="text-2xl font-bold text-gray-900">{{ availableModules.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <Icon name="shield" class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Permissions</p>
            <p class="text-2xl font-bold text-gray-900">{{ permissions.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <Icon name="user" class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Current Role</p>
            <p class="text-lg font-bold text-gray-900">{{ user?.role || 'Guest' }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Available Modules -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Available Modules</h2>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="module in availableModules"
            :key="module.id"
            :to="`/${module.id}`"
            class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <Icon :name="module.icon" class="w-6 h-6 text-blue-600" />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ module.label }}</h3>
                <p class="text-sm text-gray-600">Access {{ module.label.toLowerCase() }} features</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/modules/core/runtime/composables/useAuth'
import { definePageMeta } from '#imports'

const { user, permissions, availableModules } = useAuth()

// Set page meta
definePageMeta({
  title: 'Dashboard',
  description: 'Main dashboard overview'
})
</script>
