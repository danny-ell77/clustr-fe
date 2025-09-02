<template>
  <div class="w-full h-48 flex items-end gap-2">
    <div v-for="(v,i) in data" :key="i" class="flex-1 bg-blue-100 rounded">
      <div class="bg-blue-600 rounded w-full" :style="{ height: `${Math.max(6, v*8)}px` }"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ data: number[] }>()
</script>
