<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';
import { cn } from '@/lib/utils';
import { FormError } from '~/components/ui/form';

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes['class'];
  error?: string;
  touched?: boolean;
  type?: string;
}>();

defineOptions({ inheritAttrs: false });

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
  (e: 'blur'): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const inputClass = computed(() => {
  return cn(
    'flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-1',
    'disabled:cursor-not-allowed disabled:opacity-50',
    props.error && props.touched ? 'border-red-500' : 'border-input',
    props.class
  );
});
</script>

<template>
  <div class="space-y-1">
    <input 
      v-model="modelValue" 
      :class="inputClass"
      @blur="$emit('blur')"
      v-bind="$attrs"
      :type="props.type || 'text'"
    >
    <FormError :error="error" v-if="touched" />
  </div>
</template>
