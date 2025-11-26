<template>
  <div class="flex items-center gap-2">
    <div class="flex-1">
      <Label>Start Date</Label>
      <Input
        type="date"
        :value="startDate"
        @input="handleStartDateChange"
        :max="endDate"
      />
    </div>
    <div class="flex-1">
      <Label>End Date</Label>
      <Input
        type="date"
        :value="endDate"
        @input="handleEndDateChange"
        :min="startDate"
      />
    </div>
    <Button
      v-if="showClear && (startDate || endDate)"
      variant="ghost"
      size="sm"
      @click="clearDates"
      class="mt-6"
    >
      <Icon name="x" class="w-4 h-4" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

interface Props {
  modelValue?: { start?: string; end?: string }
  showClear?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: { start?: string; end?: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  showClear: true
})

const emit = defineEmits<Emits>()

const startDate = computed(() => props.modelValue?.start || '')
const endDate = computed(() => props.modelValue?.end || '')

const handleStartDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', {
    start: target.value,
    end: endDate.value
  })
}

const handleEndDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', {
    start: startDate.value,
    end: target.value
  })
}

const clearDates = () => {
  emit('update:modelValue', {})
}
</script>
