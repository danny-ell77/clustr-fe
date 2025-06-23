<template>
  <div class="p-6">
    <UnderConstruction 
      title="Shift Management Module"
      description="This module is under active development. Soon you'll be able to manage employee shifts, schedules, and tasks."
      :features="['Shift Scheduling', 'Time Logging', 'Task Assignment', 'Reporting']"
      :progress="40"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

// Define page meta with permissions
definePageMeta({
  title: 'Shift Management',
  description: 'Manage shifts and schedules',
  requiresPermission: 'shift.overview.view'
})
</script>
