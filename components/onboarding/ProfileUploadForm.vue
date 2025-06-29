<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Profile picture upload</h2>
    <div class="flex flex-col items-center space-y-4">
      <div class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
        <img v-if="previewUrl" :src="previewUrl" alt="Profile Preview" class="w-full h-full object-cover" />
        <Icon v-else name="camera" class="w-16 h-16 text-gray-400" />
      </div>
      <Label for="profile-picture" class="sr-only">Upload Profile Picture</Label>
      <Input id="profile-picture" type="file" @change="handleFileChange" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
    </div>

    <div v-if="uploadProgress > 0" class="space-y-2">
      <p class="text-sm text-gray-600">Upload Progress: {{ uploadProgress }}%</p>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
    </div>

    <div class="flex justify-between gap-4">
      <Button type="submit" class="flex-1 bg-blue-600 text-white hover:bg-blue-700">Save</Button>
      <Button type="button" variant="outline" class="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200" @click="emit('next')">Skip</Button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

const emit = defineEmits(['next'])

const selectedFile = ref(null)
const previewUrl = ref(null)
const uploadProgress = ref(0)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
    uploadProgress.value = 0 // Reset progress
  } else {
    selectedFile.value = null
    previewUrl.value = null
  }
}

const handleSubmit = () => {
  if (selectedFile.value) {
    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      uploadProgress.value = progress
      if (progress >= 100) {
        clearInterval(interval)
        console.log('Profile Picture Uploaded:', selectedFile.value.name)
        alert('Profile picture uploaded successfully!')
        emit('next')
      }
    }, 100)
  } else {
    console.log('No file selected, skipping upload.')
    emit('next')
  }
}
</script>
