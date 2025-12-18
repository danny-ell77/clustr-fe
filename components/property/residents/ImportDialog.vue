<template>
    <Dialog :open="open" @update:open="handleOpenChange">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Import Residents</DialogTitle>
                <DialogDescription>
                    Upload a CSV file to import multiple residents at once
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>CSV File</Label>
                    <Input type="file" accept=".csv" @change="handleFileChange" />
                    <p class="text-xs text-muted-foreground">
                        Required columns: first_name, last_name, email, phone_number, unit_number
                    </p>
                </div>

                <div v-if="validationErrors.length > 0" class="space-y-2">
                    <Label class="text-destructive">Validation Errors</Label>
                    <div class="max-h-48 overflow-y-auto border rounded-md p-3 space-y-1">
                        <p v-for="(error, index) in validationErrors" :key="index" class="text-sm text-destructive">
                            {{ error }}
                        </p>
                    </div>
                </div>

                <div v-if="previewData.length > 0" class="space-y-2">
                    <Label>Preview ({{ previewData.length }} residents)</Label>
                    <div class="max-h-64 overflow-y-auto border rounded-md">
                        <table class="w-full text-sm">
                            <thead class="bg-muted sticky top-0">
                                <tr>
                                    <th class="p-2 text-left">Name</th>
                                    <th class="p-2 text-left">Email</th>
                                    <th class="p-2 text-left">Phone</th>
                                    <th class="p-2 text-left">Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(resident, index) in previewData" :key="index" class="border-t">
                                    <td class="p-2">{{ resident.first_name }} {{ resident.last_name }}</td>
                                    <td class="p-2">{{ resident.email }}</td>
                                    <td class="p-2">{{ resident.phone_number }}</td>
                                    <td class="p-2">{{ resident.unit_number }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" @click="handleCancel">
                    Cancel
                </Button>
                <Button type="button" @click="handleImport" :disabled="!canImport || isImporting">
                    {{ isImporting ? 'Importing...' : `Import ${previewData.length} Residents` }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ResidentFormData } from '@/types/residents'

interface Props {
    open: boolean
}

interface Emits {
    (e: 'update:open', value: boolean): void
    (e: 'import', file: File): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const previewData = ref<any[]>([])
const validationErrors = ref<string[]>([])
const isImporting = ref(false)
const selectedFile = ref<File | null>(null)

const canImport = computed(() => selectedFile.value !== null && previewData.value.length > 0 && validationErrors.value.length === 0)

const handleOpenChange = (value: boolean) => {
    emit('update:open', value)
    if (!value) {
        resetState()
    }
}

const resetState = () => {
    previewData.value = []
    validationErrors.value = []
    isImporting.value = false
    selectedFile.value = null
}

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    selectedFile.value = file

    try {
        const text = await file.text()
        parseCSV(text)
    } catch (error) {
        validationErrors.value = ['Failed to read file']
    }
}

const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
        validationErrors.value = ['CSV file is empty or has no data rows']
        return
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredColumns = ['first_name', 'last_name', 'email', 'phone_number', 'unit_number']

    const missingColumns = requiredColumns.filter(col => !headers.includes(col))
    if (missingColumns.length > 0) {
        validationErrors.value = [`Missing required columns: ${missingColumns.join(', ')}`]
        return
    }

    const errors: string[] = []
    const data: ResidentFormData[] = []

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const row: Record<string, string> = {}

        headers.forEach((header, index) => {
            row[header] = values[index] || ''
        })

        if (!row.first_name) errors.push(`Row ${i}: Missing first name`)
        if (!row.last_name) errors.push(`Row ${i}: Missing last name`)
        if (!row.email) errors.push(`Row ${i}: Missing email`)
        if (!row.phone_number) errors.push(`Row ${i}: Missing phone number`)
        if (!row.unit_number) errors.push(`Row ${i}: Missing unit number`)

        if (row.email && !row.email.includes('@')) {
            errors.push(`Row ${i}: Invalid email format`)
        }

        data.push({
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            phone_number: row.phone_number,
            unit_number: row.unit_number
        })
    }

    validationErrors.value = errors
    if (errors.length === 0) {
        previewData.value = data
    }
}

const handleCancel = () => {
    handleOpenChange(false)
}

const handleImport = async () => {
    if (!selectedFile.value) return

    isImporting.value = true
    try {
        emit('import', selectedFile.value)
    } finally {
        isImporting.value = false
    }
}
</script>
