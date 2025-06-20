<template>
  <div class="p-6">
    <UnderConstruction 
      title="Tenant Chat"
      description="Enable direct and instant communication between property managers and tenants."
      :features="['Direct Messaging', 'Group Chats', 'File Sharing', 'Notification System']"
      :progress="80"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  title: 'Tenant Chat',
  description: 'Communicate directly with tenants'
})
</script>
