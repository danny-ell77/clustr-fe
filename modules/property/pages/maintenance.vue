<template>
  <div class="p-6">
    <UnderConstruction 
      title="Property Maintenance"
      description="This section will allow you to manage maintenance requests, track repairs, and schedule preventative maintenance for your properties."
      :features="['Create & Track Requests', 'Assign Technicians', 'Maintenance History', 'Cost Tracking']"
      :progress="55"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

// Define page meta with permissions
definePageMeta({
  title: 'Maintenance',
  description: 'Track maintenance requests and schedules',
  requiresPermission: 'property.maintenance.view'
})
</script>
