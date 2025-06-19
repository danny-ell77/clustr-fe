<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Shift Management</h1>
        <p class="text-gray-600">Manage staff schedules and shift assignments</p>
      </div>
      <div class="flex space-x-3">
        <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Icon name="download" class="w-4 h-4 mr-2 inline" />
          Export
        </button>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Icon name="plus" class="w-4 h-4 mr-2 inline" />
          New Shift
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Shifts</p>
            <p class="text-2xl font-bold text-gray-900">12</p>
            <p class="text-sm text-green-600">Currently ongoing</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="clock" class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Completed Shifts</p>
            <p class="text-2xl font-bold text-gray-900">15</p>
            <p class="text-sm text-blue-600">This week</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="check-circle" class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Upcoming Shifts</p>
            <p class="text-2xl font-bold text-gray-900">15</p>
            <p class="text-sm text-orange-600">Next 7 days</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Icon name="calendar" class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Under Construction -->
    <UnderConstruction 
      title="Shift Management System"
      description="Comprehensive staff scheduling and shift management platform."
      features={[
        "Automated shift scheduling and assignments",
        "Real-time shift tracking and monitoring",
        "Staff availability and time-off management",
        "Shift handover and task management",
        "Performance analytics and reporting"
      ]}
    />
  </div>
</template>

<script setup>
// Page setup
</script>
