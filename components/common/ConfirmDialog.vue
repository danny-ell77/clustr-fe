<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>

      <div v-if="showInput" class="py-4">
        <Label :for="inputId">{{ inputLabel }}</Label>
        <Textarea
          :id="inputId"
          v-model="inputValue"
          :placeholder="inputPlaceholder"
          rows="3"
          class="mt-2"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleCancel">
          {{ cancelText }}
        </Button>
        <Button
          :variant="confirmVariant"
          @click="handleConfirm"
          :disabled="isLoading || (showInput && requireInput && !inputValue)"
        >
          {{ isLoading ? 'Processing...' : confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

interface Props {
  open: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  isLoading?: boolean
  showInput?: boolean
  inputLabel?: string
  inputPlaceholder?: string
  requireInput?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'confirm', value?: string): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmVariant: 'default',
  isLoading: false,
  showInput: false,
  inputLabel: 'Notes',
  inputPlaceholder: 'Enter notes...',
  requireInput: false
})

const emit = defineEmits<Emits>()

const inputValue = ref('')
const inputId = computed(() => `confirm-input-${Math.random().toString(36).substr(2, 9)}`)

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const handleConfirm = () => {
  emit('confirm', props.showInput ? inputValue.value : undefined)
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}

watch(() => props.open, (newValue) => {
  if (!newValue) {
    inputValue.value = ''
  }
})
</script>
