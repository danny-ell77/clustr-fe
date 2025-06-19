<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Property Dashboard</h1>
      <p class="text-gray-600 mt-2">Overview of your property portfolio</p>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Icon name="building" class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Properties</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalProperties }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <Icon name="users" class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Tenants</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeTenants }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <Icon name="wrench" class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending Maintenance</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingMaintenance }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <Icon name="dollar-sign" class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Monthly Revenue</p>
            <p class="text-2xl font-bold text-gray-900">${{ stats.monthlyRevenue.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon :name="activity.icon" class="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-900">{{ activity.description }}</p>
              <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Mock data - in real app, this would come from API
const stats = ref({
  totalProperties: 24,
  activeTenants: 18,
  pendingMaintenance: 3,
  monthlyRevenue: 45600
})

const recentActivity = ref([
  {
    id: 1,
    icon: 'user-plus',
    description: 'New tenant John Doe signed lease for Apartment 4B',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    icon: 'wrench',
    description: 'Maintenance request completed for Unit 12A - Plumbing repair',
    timestamp: '4 hours ago'
  },
  {
    id: 3,
    icon: 'dollar-sign',
    description: 'Rent payment received from Sarah Johnson - Unit 8C',
    timestamp: '1 day ago'
  }
])

onMounted(() => {
  // Load dashboard data
  console.log('Property dashboard mounted')
})
</script>
