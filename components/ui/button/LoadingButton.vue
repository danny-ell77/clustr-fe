<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { type ButtonVariants, buttonVariants } from '.'
import Icon from '~/components/Icon.vue'

interface Props extends /* @vue-ignore */ PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  disabled: false,
  type: 'button',
  loading: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <Primitive 
    :as="as" 
    :as-child="asChild" 
    :disabled="disabled || loading"
    :type="type"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    @click="handleClick"
    @mousedown.prevent
  >
    <Icon 
      v-if="loading" 
      name="loader-2" 
      class="w-4 h-4 mr-2 animate-spin" 
    />
    <template v-if="loading && loadingText">
      {{ loadingText }}
    </template>
    <slot v-else />
  </Primitive>
</template>
