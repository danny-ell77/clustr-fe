<template>
  <UnderConstruction
    title="Community Rule Book"
    description="Our digital rule book is being developed to provide easy access to all community guidelines, regulations, and policies."
    :features="[
      'Searchable regulations database',
      'Categorized guidelines',
      'Updated policies and procedures',
      'Downloadable documents',
      'FAQ section',
      'Regular updates notifications'
    ]"
    :progress="25"
  />
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
</script>