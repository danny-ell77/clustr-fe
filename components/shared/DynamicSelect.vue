<template>
  <Select v-model="internalValue" v-bind="$attrs">
    <SelectTrigger :id="id" :class="triggerClass">
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem 
        v-for="option in normalizedOptions" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '~/components/ui/select'

// Type definitions for better type safety
export interface SelectOption {
  name: string
  value: string | number
}

export interface DynamicSelectProps {
  modelValue?: string | number | null
  options: string[] | SelectOption[]
  placeholder?: string
  id?: string
  triggerClass?: HTMLAttributes['class']
}

export interface DynamicSelectEmits {
  (e: 'update:modelValue', value: string | number | null): void
}

const props = withDefaults(defineProps<DynamicSelectProps>(), {
  placeholder: 'Select an option',
  modelValue: null
})

const emit = defineEmits<DynamicSelectEmits>()

// Computed property to normalize options to a consistent format
const normalizedOptions = computed<SelectOption[]>(() => {
  return props.options.map(option => {
    if (typeof option === 'string') {
      return {
        name: option,
        value: option
      }
    }
    return option
  })
})

// Internal v-model handling
const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>