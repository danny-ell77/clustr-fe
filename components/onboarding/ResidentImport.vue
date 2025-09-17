<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Import Residents</h2>
    
    <div class="space-y-4">
      <!-- Template Download -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="font-medium mb-2">Download Template</h3>
        <div class="flex gap-2">
          <Button 
            v-for="format in ['CSV', 'XLSX', 'XLS']" 
            :key="format"
            variant="outline"
            size="sm"
            @click="downloadTemplate(format)"
          >
            {{ format }}
          </Button>
        </div>
      </div>

      <!-- File Upload -->
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <FileUpload
          id="resident-import"
          label="Upload Resident Data"
          accept=".csv,.xlsx,.xls"
          :maxSize="5242880"
          @uploaded="handleFileUpload"
          @error="handleUploadError"
        />
      </div>

      <!-- Column Mapping (shown after file upload) -->
      <div v-if="uploadedFile" class="space-y-4">
        <h3 class="font-medium">Map Columns</h3>
        <div class="grid gap-4">
          <div v-for="field in requiredFields" :key="field.key" class="flex items-center gap-2">
            <label class="w-1/3">{{ field.label }}</label>
            <select
              v-model="columnMapping[field.key]"
              class="form-select w-2/3"
            >
              <option value="">Select column</option>
              <option v-for="col in availableColumns" :key="col" :value="col">
                {{ col }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Options -->
      <div v-if="uploadedFile" class="space-y-2">
        <div class="flex items-center gap-2">
          <Checkbox v-model="importOptions.hasHeaders" id="has-headers" />
          <label for="has-headers">File has header row</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="importOptions.shouldUpsert" id="should-upsert" />
          <label for="should-upsert">Update existing records</label>
        </div>
        <div class="flex items-center gap-4">
          <label>Default Dialing Code:</label>
          <Input
            v-model="importOptions.defaultDialingCode"
            placeholder="+234"
            class="w-24"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-between gap-4">
      <Button 
        type="button" 
        variant="outline" 
        class="flex-1" 
        @click="$emit('skip')"
      >
        Skip for now
      </Button>
      <Button 
        type="submit"
        class="flex-1"
        :variant="canSubmit ? 'default' : 'secondary'"
        :disabled="!canSubmit || isLoading"
        @click="handleSubmit"
      >
        {{ isLoading ? 'Importing...' : 'Import Residents' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FileUpload from '~/components/shared/FileUpload'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Checkbox } from '~/components/ui/checkbox'
import { useUserManagement } from '~/composables/useUserManagement'
import type { FormatEnum } from '~/types/auth'

const emit = defineEmits(['next', 'skip'])

const { importResidents, getImportTemplate, isLoading } = useUserManagement()

const uploadedFile = ref<File | null>(null)
const availableColumns = ref<string[]>([])
const columnMapping = ref<Record<string, string>>({})
const importError = ref<string | null>(null)

const importOptions = ref({
  hasHeaders: true,
  shouldUpsert: false,
  defaultDialingCode: '+234'
})

const requiredFields = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'unit', label: 'Unit/Apartment' }
]

// Check if all required fields are mapped
const canSubmit = computed(() => {
  return uploadedFile.value && 
         requiredFields.every(field => columnMapping.value[field.key])
})

const downloadTemplate = async (format: keyof typeof FormatEnum) => {
  try {
    const template = await getImportTemplate(format)
    // Handle template download (depends on API response format)
    const blob = new Blob([template], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resident-template.${format.toLowerCase()}`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download template:', error)
  }
}

const handleFileUpload = async (files: { name: string; url: string }[]) => {
  if (!files.length) return
  
  uploadedFile.value = files[0]
  // Here you might want to parse the file to get column headers
  // This depends on the file format (CSV, XLSX, etc.)
  // For now, we'll simulate some columns
  availableColumns.value = ['Full Name', 'Email', 'Phone', 'Unit Number', 'Notes']
}

const handleUploadError = (message: string) => {
  importError.value = message
}

const handleSubmit = async () => {
  if (!uploadedFile.value || !canSubmit.value) return

  try {
    await importResidents({
      file: uploadedFile.value,
      columnMapping: columnMapping.value,
      hasHeaders: importOptions.value.hasHeaders,
      shouldUpsert: importOptions.value.shouldUpsert,
      defaultDialingCode: importOptions.value.defaultDialingCode,
      format: uploadedFile.value.name.toLowerCase().endsWith('csv') ? 'CSV' : 'XLSX'
    })

    emit('next')
  } catch (error) {
    console.error('Failed to import residents:', error)
    importError.value = 'Failed to import residents. Please try again.'
  }
}
</script>