<template>
  <div class="flex items-center justify-between p-3 border-b bg-white">
    <div class="flex items-center gap-2">
      <h3 class="font-semibold">{{ title }}</h3>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="ghost" size="icon"><Icon name="search" class="w-4 h-4" /></Button>
      <Button variant="ghost" size="icon"><Icon name="more-vertical" class="w-4 h-4" /></Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

defineProps<{ title: string }>()
</script>
