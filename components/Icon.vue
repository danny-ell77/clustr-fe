<template>
  <component :is="iconComponent" :class="className" />
</template>

<script setup>
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'default'
  },
  class: {
    type: String,
    default: ''
  }
})

const iconComponent = computed(() => {
  // Convert kebab-case to PascalCase
  const pascalName = props.name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  
  return LucideIcons[pascalName] || LucideIcons.HelpCircle
})

const className = computed(() => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6'
  }
  
  return `${sizeClasses[props.size] || sizeClasses.default} ${props.class}`
})
</script>
