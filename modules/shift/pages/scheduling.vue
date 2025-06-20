<template>
  <div class="p-6">
    <UnderConstruction 
      title="Shift Scheduling"
      description="Plan and manage employee shifts, create schedules, and handle shift assignments efficiently."
      :features="['Drag-and-Drop Scheduling', 'Shift Templates', 'Employee Availability', 'Conflict Detection']"
      :progress="45"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  title: 'Shift Scheduling',
  description: 'Manage employee shifts and schedules'
})
</script>
