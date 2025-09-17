<template>
  <transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  error?: string;
}>();
</script>