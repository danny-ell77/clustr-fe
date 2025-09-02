<template>
  <div class="space-y-2">
    <Label :for="id">{{ label }}</Label>
    <Input :id="id" type="file" :accept="accept" multiple @change="onChange" />
    <div v-if="files.length" class="space-y-2">
      <div v-for="f in files" :key="f.id" class="flex items-center justify-between rounded-md border p-2">
        <div class="flex items-center gap-3">
          <Icon name="paperclip" class="w-4 h-4 text-gray-500" />
          <span class="text-sm">{{ f.file.name }}</span>
        </div>
        <span class="text-xs text-gray-500">{{ f.progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import Icon from '~/components/Icon.vue'

const props = defineProps<{ id: string; label: string; accept?: string }>()
const emit = defineEmits<{ (e: 'uploaded', files: { name: string; url: string }[]): void }>()

const files = ref<{ id: string; file: File; progress: number }[]>([])

function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  const selected = Array.from(target.files || [])
  files.value = selected.map((file, idx) => ({ id: `${Date.now()}-${idx}`, file, progress: 0 }))
  simulateUpload()
}

function simulateUpload() {
  const interval = setInterval(() => {
    let done = true
    files.value = files.value.map((f) => {
      const next = Math.min(100, f.progress + 10)
      if (next < 100) done = false
      return { ...f, progress: next }
    })
    if (done) {
      clearInterval(interval)
      emit('uploaded', files.value.map((f) => ({ name: f.file.name, url: URL.createObjectURL(f.file) })))
    }
  }, 120)
}
</script>
