<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ isEdit ? 'Edit Resident' : 'Add New Resident' }}</DialogTitle>
        <DialogDescription>
          {{ isEdit ? 'Update resident information' : 'Add a new resident to the property' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name -->
        <div class="space-y-2">
          <Label for="name">Full Name *</Label>
          <Input id="name" v-model="formData.name" placeholder="John Doe" required />
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <Label for="emailAddress">Email *</Label>
          <Input id="emailAddress" v-model="formData.emailAddress" type="email" placeholder="john.doe@example.com"
            required />
        </div>

        <!-- Phone Number -->
        <div class="space-y-2">
          <Label for="phoneNumber">Phone Number *</Label>
          <Input id="phoneNumber" v-model="formData.phoneNumber" placeholder="+234 800 000 0000" required />
        </div>

        <!-- Unit Address -->
        <div class="space-y-2">
          <Label for="unitAddress">Unit Address</Label>
          <Input id="unitAddress" v-model="formData.unitAddress" placeholder="A101" />
        </div>

        <!-- Property Type -->
        <div class="space-y-2">
          <Label for="propertyType">Property Type</Label>
          <Input id="propertyType" v-model="formData.propertyType" placeholder="Apartment, Villa, etc." />
        </div>

        <!-- Approved by Admin -->
        <div class="flex items-center space-x-2">
          <input id="approvedByAdmin" v-model="formData.approvedByAdmin" type="checkbox" class="h-4 w-4" />
          <Label for="approvedByAdmin" class="cursor-pointer">Approve Resident</Label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="handleCancel">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Add') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Resident, CreateResidentDto, UpdateResidentDto } from '@/types/residents'

interface Props {
  open: boolean
  resident?: Resident | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: CreateResidentDto | UpdateResidentDto): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEdit = computed(() => !!props.resident)
const isSubmitting = ref(false)

const resetForm = () => {
  formData.value = {
    name: '',
    emailAddress: '',
    phoneNumber: '',
    unitAddress: '',
    propertyType: '',
    approvedByAdmin: false
  }
}

const formData = ref<CreateResidentDto>({
  name: '',
  emailAddress: '',
  phoneNumber: '',
  unitAddress: '',
  propertyType: '',
  approvedByAdmin: false
})

watch(
  () => props.resident,
  (resident) => {
    if (resident) {
      formData.value = {
        name: resident.name,
        emailAddress: resident.emailAddress,
        phoneNumber: resident.phoneNumber,
        unitAddress: resident.unitAddress || '',
        propertyType: resident.propertyType || '',
        approvedByAdmin: resident.approvedByAdmin
      }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)


const handleOpenChange = (value: boolean) => {
  emit('update:open', value)
  if (!value) resetForm()
}

const handleCancel = () => {
  handleOpenChange(false)
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    emit('submit', formData.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>
