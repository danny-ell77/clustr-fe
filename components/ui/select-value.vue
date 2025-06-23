<template>
  <span class="block truncate">
    <slot>{{ placeholder }}</slot>
  </span>
</template>

<script setup>
defineProps({
  placeholder: {
    type: String,
    default: 'Select an option'
  }
})
</script>
