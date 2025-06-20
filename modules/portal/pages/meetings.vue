<template>
  <div class="p-6">
    <UnderConstruction 
      title="Tenant Meetings"
      description="Schedule and manage virtual or in-person meetings with tenants for various purposes."
      :features="['Meeting Scheduler', 'Calendar Integration', 'Meeting Reminders', 'Meeting Notes']"
      :progress="85"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  title: 'Tenant Meetings',
  description: 'Schedule and manage meetings with tenants'
})
</script>
