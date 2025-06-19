<template>
  <div class="p-6">
    <UnderConstruction 
      title="Tenant Portal Module"
      description="This module is under active development. Soon tenants will have access to chat, meeting schedules, and important announcements."
      :features="['Direct Messaging', 'Meeting Scheduler', 'Announcements Board', 'Document Sharing']"
      :progress="75"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  title: 'Tenant Portal',
  description: 'Communication and resources for tenants'
})
</script>
