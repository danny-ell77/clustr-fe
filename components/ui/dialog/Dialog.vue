<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])
</script>
<template>
  <div v-if="props.open" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="emit('update:open', false)" />
    <div class="relative z-10 w-full max-w-lg"> <slot /> </div>
  </div>
</template>
