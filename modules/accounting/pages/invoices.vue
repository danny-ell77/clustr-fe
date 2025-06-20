<template>
  <div class="p-6">
    <UnderConstruction 
      title="Invoices"
      description="Manage all your invoices, create new ones, track their status, and send reminders."
      :features="['Create Invoices', 'Invoice Status Tracking', 'Automated Reminders', 'Export Invoices']"
      :progress="45"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  title: 'Invoices',
  description: 'Manage invoices and billing'
})
</script>
