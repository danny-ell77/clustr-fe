<template>
  <UnderConstruction
    title="Community Polls"
    description="Our polling system is being developed to help gather community feedback and make collective decisions easier."
    :features="[
      'Create and manage polls',
      'Real-time voting results',
      'Multiple choice questions',
      'Poll analytics and insights',
      'Anonymous voting options',
      'Poll result visualization'
    ]"
    :progress="30"
  />
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
</script>