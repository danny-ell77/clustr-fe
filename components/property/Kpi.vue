<template>
  <div class="rounded-lg border bg-white p-4">
    <p class="text-sm text-gray-500">{{ title }}</p>
    <div class="mt-2 flex items-baseline gap-2">
      <span class="text-2xl font-semibold">{{ value }}</span>
      <span :class="[color, 'w-2 h-2 rounded-full inline-block']"></span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ title: string; value: number; color: string }>()
</script>
