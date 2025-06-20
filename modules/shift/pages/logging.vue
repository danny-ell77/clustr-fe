<template>
  <div class="p-6">
    <UnderConstruction 
      title="Time Logging"
      description="Allow employees to log their work hours, track breaks, and manage their timesheets."
      :features="['Clock In/Out', 'Manual Time Entries', 'Timesheet Approval', 'Reporting']"
      :progress="50"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  title: 'Time Logging',
  description: 'Track employee work hours'
})
</script>
