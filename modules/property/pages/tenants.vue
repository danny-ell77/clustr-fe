<template>
  <div class="p-6">
    <UnderConstruction 
      title="Property Tenants"
      description="This section will provide comprehensive tools for managing tenant information, leases, and communication."
      :features="['Tenant Profiles', 'Lease Management', 'Communication Tools', 'Payment History']"
      :progress="60"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

// Define page meta with permissions
definePageMeta({
  title: 'Tenants',
  description: 'Manage tenant information and leases',
  requiresPermission: 'property.tenants.view'
})
</script>
