<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div
      v-if="icon"
      class="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4"
    >
      <Icon :name="icon" class="w-8 h-8 text-muted-foreground" />
    </div>

    <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
    <p class="text-sm text-muted-foreground max-w-md mb-6">{{ description }}</p>

    <div v-if="$slots.action || actionText" class="flex gap-2">
      <slot name="action">
        <Button v-if="actionText" @click="handleAction">
          <Icon v-if="actionIcon" :name="actionIcon" class="w-4 h-4 mr-2" />
          {{ actionText }}
        </Button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

interface Props {
  icon?: string
  title: string
  description: string
  actionText?: string
  actionIcon?: string
}

interface Emits {
  (e: 'action'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleAction = () => {
  emit('action')
}
</script>
