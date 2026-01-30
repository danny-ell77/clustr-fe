<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  open?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  side: 'right'
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const sideClasses = {
  left: 'left-0 top-0 h-full w-80 border-r',
  right: 'right-0 top-0 h-full w-80 border-l',
  top: 'top-0 left-0 w-full h-80 border-b',
  bottom: 'bottom-0 left-0 w-full h-80 border-t'
}

const slideClasses = {
  left: 'data-[state=closed]:-translate-x-full',
  right: 'data-[state=closed]:translate-x-full',
  top: 'data-[state=closed]:-translate-y-full',
  bottom: 'data-[state=closed]:translate-y-full'
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50">
      <!-- Overlay -->
      <div 
        class="fixed inset-0 bg-black/50 transition-opacity"
        @click="isOpen = false"
      />
      
      <!-- Sheet -->
      <div 
        :class="[
          'fixed bg-background shadow-lg transition-transform duration-300',
          sideClasses[side],
          slideClasses[side]
        ]"
        :data-state="isOpen ? 'open' : 'closed'"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
