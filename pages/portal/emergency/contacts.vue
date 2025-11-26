<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold">Emergency Contacts</h1>
                <p class="text-muted-foreground">Manage estate-wide and personal emergency contacts</p>
            </div>

            <Button @click="openCreateDialog">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                Add Contact
            </Button>
        </div>

        <Card>
            <CardContent class="pt-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label>Contact Type</Label>
                        <Select @update:model-value="(value) => setFilter('contactType', String(value))">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                <SelectItem :value="EmergencyContactType.ESTATE_WIDE">Estate-Wide</SelectItem>
                                <SelectItem :value="EmergencyContactType.PERSONAL">Personal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Emergency Type</Label>
                        <Select @update:model-value="(value) => setFilter('emergencyType', String(value))">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                <SelectItem :value="EmergencyType.FIRE">Fire</SelectItem>
                                <SelectItem :value="EmergencyType.MEDICAL">Medical</SelectItem>
                                <SelectItem :value="EmergencyType.SECURITY">Security</SelectItem>
                                <SelectItem :value="EmergencyType.ACCIDENT">Accident</SelectItem>
                                <SelectItem :value="EmergencyType.NATURAL_DISASTER">Natural Disaster</SelectItem>
                                <SelectItem :value="EmergencyType.UTILITY_FAILURE">Utility Failure</SelectItem>
                                <SelectItem :value="EmergencyType.OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select @update:model-value="(value) => setFilter('isActive', String(value))">
                            <SelectTrigger>
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex items-end">
                        <Button variant="outline" @click="clearFilters">
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent class="p-0">
                <div class="w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead v-for="column in columns" :key="column.key">
                                    {{ column.label }}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-if="contactsQuery.isLoading.value" v-for="i in 5" :key="i">
                                <TableCell v-for="column in columns" :key="column.key">
                                    <Skeleton class="h-4 w-full" />
                                </TableCell>
                            </TableRow>

                            <TableRow v-else-if="!contacts.length">
                                <TableCell :colspan="columns.length" class="text-center py-8">
                                    <EmptyState title="No Contacts" description="No emergency contacts found" />
                                </TableCell>
                            </TableRow>

                            <TableRow v-else v-for="row in contacts" :key="row.id" class="hover:bg-muted/50">
                                <TableCell>
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium">{{ row.name }}</span>
                                        <Badge v-if="row.isPrimary" variant="secondary" class="text-xs">Primary</Badge>
                                    </div>
                                </TableCell>
                                <TableCell>{{ row.phoneNumber }}</TableCell>
                                <TableCell>{{ row.email || '-' }}</TableCell>
                                <TableCell>
                                    <Badge
                                        :variant="row.contactType === EmergencyContactType.ESTATE_WIDE ? 'default' : 'outline'">
                                        {{ row.contactTypeDisplay }}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div class="flex flex-wrap gap-1">
                                        <Badge v-for="type in row.emergencyTypesDisplay.slice(0, 2)" :key="type"
                                            variant="secondary" class="text-xs">
                                            {{ type }}
                                        </Badge>
                                        <Badge v-if="row.emergencyTypesDisplay.length > 2" variant="secondary"
                                            class="text-xs">
                                            +{{ row.emergencyTypesDisplay.length - 2 }}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge :variant="row.isActive ? 'default' : 'secondary'">
                                        {{ row.isActive ? 'Active' : 'Inactive' }}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" @click.stop="openEditDialog(row)">
                                            <Icon name="edit" class="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" @click.stop="handleDelete(row)">
                                            <Icon name="trash" class="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        <Dialog v-model:open="showDialog">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{{ editingContact ? 'Edit Contact' : 'Add Contact' }}</DialogTitle>
                    <DialogDescription>
                        {{ editingContact ? 'Update emergency contact details' : 'Create a new emergency contact' }}
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <Label for="name">Name *</Label>
                        <Input id="name" v-model="formData.name" placeholder="Contact name" required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="phoneNumber">Phone Number *</Label>
                            <Input id="phoneNumber" v-model="formData.phoneNumber" placeholder="+234..." required />
                        </div>

                        <div>
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="formData.email" type="email" placeholder="contact@example.com" />
                        </div>
                    </div>

                    <div>
                        <Label>Contact Type *</Label>
                        <Select v-model="formData.contactType" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem :value="EmergencyContactType.ESTATE_WIDE">Estate-Wide</SelectItem>
                                <SelectItem :value="EmergencyContactType.PERSONAL">Personal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Emergency Types *</Label>
                        <div class="grid grid-cols-2 gap-2 mt-2">
                            <div v-for="type in emergencyTypeOptions" :key="type.value" class="flex items-center gap-2">
                                <Checkbox :id="`type-${type.value}`"
                                    :checked="formData.emergencyTypes.includes(type.value)"
                                    @update:checked="(checked: boolean) => toggleEmergencyType(type.value, checked)" />
                                <Label :for="`type-${type.value}`" class="text-sm font-normal cursor-pointer">
                                    {{ type.label }}
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="responseTime">Response Time (minutes)</Label>
                            <Input id="responseTime" v-model.number="formData.responseTimeMinutes" type="number" min="0"
                                placeholder="15" />
                        </div>

                        <div class="flex items-center gap-2 pt-6">
                            <Checkbox id="isPrimary" v-model:checked="formData.isPrimary" />
                            <Label for="isPrimary" class="text-sm font-normal cursor-pointer">
                                Set as primary contact
                            </Label>
                        </div>
                    </div>

                    <div>
                        <Label for="notes">Notes</Label>
                        <Textarea id="notes" v-model="formData.notes" placeholder="Additional information..."
                            rows="3" />
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" @click="closeDialog">
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Saving...' : editingContact ? 'Update' : 'Create' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <ConfirmDialog v-model:open="showDeleteDialog" title="Delete Contact"
            description="Are you sure you want to delete this emergency contact? This action cannot be undone."
            confirm-text="Delete" cancel-text="Cancel" variant="destructive" @confirm="confirmDelete" />
    </div>
</template>

<script setup lang="ts">
import { useEmergency } from '~/composables/portal/useEmergency'
import { useDataFilters } from '~/composables/useDataFilters'
import { EmergencyType, EmergencyContactType } from '~/types/emergency'
import type { EmergencyContact, CreateEmergencyContactDto } from '~/types/emergency'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'

definePageMeta({
    layout: 'default'
})

const {
    useEmergencyContacts,
    createContactMutation,
    updateContactMutation,
    deleteContactMutation
} = useEmergency()

const filterDefinitions = [
    { field: 'contactType', type: 'select' as const, label: 'Contact Type' },
    { field: 'emergencyType', type: 'select' as const, label: 'Emergency Type' },
    { field: 'isActive', type: 'select' as const, label: 'Status' }
]

const { currentQuery, setFilter, clearFilters } = useDataFilters(filterDefinitions, {
    persistKey: 'emergency-contacts-filters'
})

const contactsQuery = useEmergencyContacts(currentQuery as any)

const contacts = computed(() => contactsQuery.data.value?.results || [])

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const editingContact = ref<EmergencyContact | null>(null)
const contactToDelete = ref<EmergencyContact | null>(null)

const formData = reactive<CreateEmergencyContactDto>({
    name: '',
    phoneNumber: '',
    email: '',
    emergencyTypes: [],
    contactType: EmergencyContactType.ESTATE_WIDE,
    isPrimary: false,
    responseTimeMinutes: undefined,
    notes: ''
})

const emergencyTypeOptions = [
    { value: EmergencyType.FIRE, label: 'Fire' },
    { value: EmergencyType.MEDICAL, label: 'Medical' },
    { value: EmergencyType.SECURITY, label: 'Security' },
    { value: EmergencyType.ACCIDENT, label: 'Accident' },
    { value: EmergencyType.NATURAL_DISASTER, label: 'Natural Disaster' },
    { value: EmergencyType.UTILITY_FAILURE, label: 'Utility Failure' },
    { value: EmergencyType.OTHER, label: 'Other' }
]

const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'phoneNumber', label: 'Phone', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'contactType', label: 'Type', sortable: true },
    { key: 'emergencyTypes', label: 'Emergency Types', sortable: false },
    { key: 'isActive', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
]

const isSubmitting = computed(() =>
    createContactMutation.isPending.value || updateContactMutation.isPending.value
)

const openCreateDialog = () => {
    editingContact.value = null
    resetForm()
    showDialog.value = true
}

const openEditDialog = (contact: EmergencyContact) => {
    editingContact.value = contact
    Object.assign(formData, {
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        email: contact.email || '',
        emergencyTypes: [...contact.emergencyTypes],
        contactType: contact.contactType,
        isPrimary: contact.isPrimary,
        responseTimeMinutes: contact.responseTimeMinutes,
        notes: contact.notes || ''
    })
    showDialog.value = true
}

const closeDialog = () => {
    showDialog.value = false
    editingContact.value = null
    resetForm()
}

const resetForm = () => {
    Object.assign(formData, {
        name: '',
        phoneNumber: '',
        email: '',
        emergencyTypes: [],
        contactType: EmergencyContactType.ESTATE_WIDE,
        isPrimary: false,
        responseTimeMinutes: undefined,
        notes: ''
    })
}

const toggleEmergencyType = (type: EmergencyType, checked: boolean) => {
    if (checked) {
        if (!formData.emergencyTypes.includes(type)) {
            formData.emergencyTypes.push(type)
        }
    } else {
        const index = formData.emergencyTypes.indexOf(type)
        if (index > -1) {
            formData.emergencyTypes.splice(index, 1)
        }
    }
}

const handleSubmit = async () => {
    if (formData.emergencyTypes.length === 0) {
        useToast().error('Please select at least one emergency type')
        return
    }

    if (editingContact.value) {
        await updateContactMutation.mutateAsync({
            id: editingContact.value.id,
            data: formData
        })
    } else {
        await createContactMutation.mutateAsync(formData)
    }
    closeDialog()
}

const handleDelete = (contact: EmergencyContact) => {
    contactToDelete.value = contact
    showDeleteDialog.value = true
}

const confirmDelete = async () => {
    if (contactToDelete.value) {
        await deleteContactMutation.mutateAsync(contactToDelete.value.id)
        contactToDelete.value = null
    }
}
</script>
