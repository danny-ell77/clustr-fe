<template>
  <UnderConstruction
    title="Handy Man Services"
    description="Our handyman service connection platform is being developed to help you easily find and book qualified maintenance professionals."
    :features="[
      'Service provider listings',
      'Online booking system',
      'Service ratings and reviews',
      'Real-time availability',
      'Emergency service requests',
      'Service history tracking'
    ]"
    :progress="35"
  />
</template>

<script setup>
import UnderConstruction from '~/components/UnderConstruction.vue'
</script>