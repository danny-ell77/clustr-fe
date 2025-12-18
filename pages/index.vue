<template>
  <div>
    <div class="mb-8">
      <Typography variant="h1" as="h1">Dashboard</Typography>
      <p class="text-gray-600 mt-2">Welcome to your property management system</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary/15 rounded-full">
            <Icon name="building" class="w-6 h-6 text-primary" />
          </div>
          <div class="ml-4">
            <p class="text-sm section-title text-gray-600">Available Modules</p>
            <p class="text-2xl text-gray-900 stat-number">{{ availableModules.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-full">
            <Icon name="shield" class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm section-title text-gray-600">Active Permissions</p>
            <p class="text-2xl text-gray-900 stat-number">{{ permissions.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-full">
            <Icon name="user" class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm section-title text-gray-600">Current Role</p>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
              {{ user?.role || 'Guest' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Modules -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <Typography variant="h2" as="h2" class="section-title">Available Modules</Typography>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink v-for="module in availableModules" :key="module.id" :to="`/${module.id}`"
            class="p-4 border border-gray-200 rounded-lg module-card hover:border-blue-300">
            <div class="flex items-center">
              <div class="p-2 bg-primary/15 rounded-full">
                <Icon :name="module.icon" class="w-6 h-6 text-primary" />
              </div>
              <div class="ml-4">
                <Typography variant="h3" as="h3" class="section-title">{{ module.label }}</Typography>
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
import { useAuth } from '~/composables/auth/useAuth'
import { definePageMeta } from '#imports'
import Icon from '~/components/Icon.vue'

const { user, permissions, availableModules } = useAuth()

// Set page meta
definePageMeta({
  auth: false,
  title: 'Dashboard',
  description: 'Main dashboard overview'
})
</script>
