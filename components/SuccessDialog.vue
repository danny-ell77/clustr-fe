<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px] p-6 text-center">
      <DialogHeader>
        <div class="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Icon name="check" class="w-10 h-10 text-green-600" />
        </div>
        <DialogTitle class="text-2xl font-bold text-gray-900">Success!</DialogTitle>
        <DialogDescription class="text-gray-600 mt-2">
          {{ message }}
        </DialogDescription>
      </DialogHeader>
      <div class="mt-6">
        <Button @click="emit('update:open', false)" class="w-full bg-blue-600 text-white hover:bg-blue-700">
          OK
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>






import Icon from '~/components/Icon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Operation completed successfully.'
  }
})

const emit = defineEmits(['update:open'])
</script>
