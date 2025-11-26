<template>
  <UnderConstruction
    title="Portal Reports"
    description="Our comprehensive reporting system is currently under development. Soon you'll be able to generate and view detailed reports about portal activities and engagement metrics."
    :features="[
      'Activity and engagement analytics',
      'Custom report generation',
      'Data visualization and charts',
      'Export reports in multiple formats',
      'Scheduled automated reports',
      'User interaction metrics'
    ]"
    :progress="40"
  />
</template>

<script setup>
import UnderConstruction from '~/components/UnderConstruction.vue'
</script>