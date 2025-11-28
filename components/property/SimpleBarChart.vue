<template>
  <div class="w-full h-48 flex items-end gap-2">
    <div v-for="(v,i) in data" :key="i" class="flex-1 bg-primary/15 rounded">
      <div class="bg-primary rounded w-full" :style="{ height: `${Math.max(6, v*8)}px` }"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ data: number[] }>()
</script>
