<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="text-gray-400 hover:text-gray-600">
        <Icon name="bell" class="w-5 h-5" />
        <span v-if="unreadCount" class="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center">{{ unreadCount }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-80" align="end">
      <div class="p-2">
        <p class="text-sm font-medium">Notifications</p>
      </div>
      <div class="max-h-80 overflow-auto">
        <div v-for="n in items" :key="n.id" class="px-3 py-2 text-sm flex gap-2" :class="n.read ? 'bg-white' : 'bg-blue-50'">
          <span class="mt-1"><Icon :name="n.icon || 'bell'" class="w-4 h-4 text-gray-500" /></span>
          <div class="flex-1">
            <p class="leading-5">{{ n.text }}</p>
            <p class="text-xs text-gray-500">{{ new Date(n.time).toLocaleString() }}</p>
          </div>
          <Button variant="ghost" size="icon" @click.stop="markRead(n.id)"><Icon name="check" class="w-4 h-4" /></Button>
        </div>
      </div>
      <div class="p-2 flex justify-end">
        <Button variant="ghost" @click="markAll">Mark all as read</Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

const items = ref<{ id: string; text: string; time: string; read: boolean; icon?: string }[]>([
  { id: 'n1', text: 'New maintenance assigned to you', time: new Date().toISOString(), read: false, icon:'wrench' },
  { id: 'n2', text: 'Report r2 moved to review', time: new Date().toISOString(), read: false, icon:'bar-chart' },
])
const unreadCount = computed(()=> items.value.filter(i=>!i.read).length )
function markRead(id: string){ const i = items.value.find(n=>n.id===id); if(i) i.read = true }
function markAll(){ items.value.forEach(n=> n.read = true) }
</script>
