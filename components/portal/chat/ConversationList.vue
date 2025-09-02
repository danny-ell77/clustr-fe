<template>
  <div class="flex flex-col h-full border-r bg-white">
    <div class="p-3">
      <Input v-model="query" placeholder="Search" />
    </div>
    <div class="flex-1 overflow-auto">
      <button
        v-for="c in filtered"
        :key="c.id"
        class="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between"
        :class="c.id === modelValue ? 'bg-blue-50' : ''"
        @click="$emit('update:modelValue', c.id)"
      >
        <div>
          <p class="font-medium text-sm">{{ c.name }}</p>
          <p class="text-xs text-gray-500 truncate max-w-[200px]">{{ c.lastMessage }}</p>
        </div>
        <Badge v-if="c.unread" variant="secondary">{{ c.unread }}</Badge>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import type { Conversation } from '~/types/portal'

const props = defineProps<{ conversations: Conversation[]; modelValue: string | null }>()
const query = ref('')
const filtered = computed(() => props.conversations.filter(c => c.name.toLowerCase().includes(query.value.toLowerCase())))
</script>
