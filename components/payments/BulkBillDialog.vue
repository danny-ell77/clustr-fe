<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-3xl">
            <DialogHeader>
                <DialogTitle>Create Bulk Bills</DialogTitle>
                <DialogDescription>Create bills for multiple users at once</DialogDescription>
            </DialogHeader>

            <DialogBody>
                <div class="space-y-4">
                    <div class="flex gap-2 border-b pb-4">
                        <Button variant="outline" :class="{ 'bg-primary text-primary-foreground': mode === 'manual' }"
                            @click="mode = 'manual'">
                            Manual Selection
                        </Button>
                        <Button variant="outline" :class="{ 'bg-primary text-primary-foreground': mode === 'csv' }"
                            @click="mode = 'csv'">
                            CSV Upload
                        </Button>
                    </div>

                    <div v-if="mode === 'manual'" class="space-y-4">
                        <div>
                            <Label for="title">Bill Title *</Label>
                            <Input id="title" v-model="billTemplate.title" placeholder="e.g., Monthly Service Charge"
                                required />
                        </div>

                        <div>
                            <Label for="description">Description</Label>
                            <Textarea id="description" v-model="billTemplate.description"
                                placeholder="Additional details" rows="2" />
                        </div>

                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <Label for="type">Bill Type *</Label>
                                <Select v-model="billTemplate.type" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                                        <SelectItem value="WATER">Water</SelectItem>
                                        <SelectItem value="SECURITY">Security</SelectItem>
                                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                        <SelectItem value="SERVICE_CHARGE">Service Charge</SelectItem>
                                        <SelectItem value="WASTE_MANAGEMENT">Waste Management</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label for="amount">Amount (NGN) *</Label>
                                <Input id="amount" v-model="billTemplate.amount" type="number" step="0.01" min="0"
                                    placeholder="0.00" required />
                            </div>

                            <div>
                                <Label for="dueDate">Due Date *</Label>
                                <Input id="dueDate" v-model="billTemplate.dueDate" type="date" required />
                            </div>
                        </div>

                        <div>
                            <Label>Select Users *</Label>
                            <div class="border rounded-md p-4 max-h-64 overflow-y-auto space-y-2">
                                <div class="flex items-center space-x-2 pb-2 border-b">
                                    <input id="selectAll" type="checkbox"
                                        :checked="selectedUsers.length === users.length" @change="toggleSelectAll"
                                        class="rounded border-gray-300" />
                                    <Label for="selectAll" class="cursor-pointer font-medium">Select All ({{
                                        users.length }} users)</Label>
                                </div>
                                <div v-for="user in users" :key="user.id" class="flex items-center space-x-2">
                                    <input :id="`user-${user.id}`" v-model="selectedUsers" type="checkbox"
                                        :value="user.id" class="rounded border-gray-300" />
                                    <Label :for="`user-${user.id}`" class="cursor-pointer flex-1">{{ user.name }} ({{
                                        user.email }})</Label>
                                </div>
                            </div>
                            <p class="text-sm text-muted-foreground mt-2">{{ selectedUsers.length }} user(s) selected
                            </p>
                        </div>
                    </div>

                    <div v-else-if="mode === 'csv'" class="space-y-4">
                        <div class="border-2 border-dashed rounded-lg p-8 text-center">
                            <input ref="fileInput" type="file" accept=".csv" class="hidden"
                                @change="handleFileUpload" />
                            <div v-if="!csvFile" class="space-y-2">
                                <Icon name="upload" class="w-12 h-12 mx-auto text-muted-foreground" />
                                <p class="text-sm text-muted-foreground">Upload a CSV file with bill details</p>
                                <Button type="button" variant="outline" @click="fileInput?.click()">Choose File</Button>
                            </div>
                            <div v-else class="space-y-2">
                                <Icon name="file" class="w-12 h-12 mx-auto text-green-600" />
                                <p class="text-sm font-medium">{{ csvFile.name }}</p>
                                <p class="text-xs text-muted-foreground">{{ (csvFile.size / 1024).toFixed(2) }} KB</p>
                                <Button type="button" variant="outline" size="sm" @click="clearFile">Remove</Button>
                            </div>
                        </div>

                        <div class="bg-muted p-4 rounded-lg">
                            <p class="text-sm font-medium mb-2">CSV Format:</p>
                            <code
                                class="text-xs">userId,title,description,type,amount,dueDate<br>user123,Service Charge,Monthly fee,SERVICE_CHARGE,5000,2024-01-31</code>
                        </div>
                    </div>

                </div>
            </DialogBody>

            <DialogFooter>
                <Button type="button" variant="outline" @click="$emit('update:open', false)">Cancel</Button>
                <Button type="button" :disabled="!canSubmit || isSubmitting" @click="handleSubmit">
                    {{ isSubmitting ? 'Creating...' : `Create ${billCount} Bill(s)` }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import Icon from '~/components/Icon.vue'
import type { BulkBillsDto, CreateBillDto, BillType } from '~/types/payments'

interface Props {
    open: boolean
    users?: Array<{ id: string; name: string; email: string }>
}

const props = withDefaults(defineProps<Props>(), {
    users: () => []
})

const emit = defineEmits<{
    'update:open': [value: boolean]
    'submit': [data: BulkBillsDto]
}>()

const mode = ref<'manual' | 'csv'>('manual')
const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement>()
const csvFile = ref<File>()
const selectedUsers = ref<string[]>([])

const billTemplate = ref<Omit<CreateBillDto, 'userId'>>({
    title: '',
    description: '',
    type: 'SERVICE_CHARGE' as BillType,
    amount: '',
    dueDate: '',
    allowPaymentAfterDue: false
})

const toggleSelectAll = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.checked) {
        selectedUsers.value = props.users.map(u => u.id)
    } else {
        selectedUsers.value = []
    }
}

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        csvFile.value = file
    }
}

const clearFile = () => {
    csvFile.value = undefined
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const billCount = computed(() => {
    if (mode.value === 'manual') {
        return selectedUsers.value.length
    }
    return csvFile.value ? '?' : 0
})

const canSubmit = computed(() => {
    if (mode.value === 'manual') {
        return billTemplate.value.title && billTemplate.value.type && billTemplate.value.amount && billTemplate.value.dueDate && selectedUsers.value.length > 0
    }
    return !!csvFile.value
})

const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        if (mode.value === 'manual') {
            const bills: CreateBillDto[] = selectedUsers.value.map(userId => ({ ...billTemplate.value, userId }))
            emit('submit', { bills })
        } else if (csvFile.value) {
            const text = await csvFile.value.text()
            const bills = parseCSV(text)
            emit('submit', { bills })
        }
    } finally {
        isSubmitting.value = false
    }
}

const parseCSV = (text: string): CreateBillDto[] => {
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())

    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const row: any = {}
        headers.forEach((header, index) => {
            row[header] = values[index]
        })

        return {
            userId: row.userId,
            title: row.title,
            description: row.description || '',
            type: row.type as BillType,
            amount: row.amount,
            dueDate: row.dueDate,
            allowPaymentAfterDue: row.allowPaymentAfterDue === 'true'
        }
    })
}
</script>
