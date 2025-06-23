<template>
  <div class="p-6">
    <UnderConstruction 
      title="Access Control Module"
      description="This module provides robust tools for managing user access, roles, and permissions within the system."
      :features="['User Management', 'Role-Based Access Control', 'Permission Configuration', 'Activity Logs']"
      :progress="70"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

// Define page meta with permissions
definePageMeta({
  title: 'Access Control',
  description: 'Manage users, roles, and permissions',
  requiresPermission: 'security.access.manage'
})
</script>
