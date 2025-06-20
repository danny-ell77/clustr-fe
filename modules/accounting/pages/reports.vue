<template>
  <div class="p-6">
    <UnderConstruction 
      title="Financial Reports"
      description="Generate detailed financial reports to gain insights into your property's performance."
      :features="['Income Statements', 'Balance Sheets', 'Cash Flow Reports', 'Customizable Reports']"
      :progress="65"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  title: 'Reports',
  description: 'Generate financial reports'
})
</script>
