<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Add Users</h2>
    <div class="relative">
      <Label for="first-name" class="sr-only">First Name</Label>
      <Input id="first-name" v-model="form.firstName" placeholder="First Name" required class="pl-9"/>
      <Icon name="user" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
    <div class="relative">
      <Label for="last-name" class="sr-only">Last Name</Label>
      <Input id="last-name" v-model="form.lastName" placeholder="Last Name" required class="pl-9"/>
      <Icon name="user" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
    <div class="relative">
      <Label for="user-email" class="sr-only">Email</Label>
      <Input id="user-email" v-model="form.email" type="email" placeholder="Email" required class="pl-9"/>
      <Icon name="mail" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
    <div>
      <Label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</Label>
      <Select v-model="form.role">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Property Manager</SelectItem>
          <SelectItem value="accountant">Accountant</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div class="space-y-2">
      <Label class="block text-sm font-medium text-gray-700">Permissions</Label>
      <div class="grid grid-cols-2 gap-2">
        <div v-for="permission in permissionsOptions" :key="permission.value" class="flex items-center">
          <input type="checkbox" :id="permission.value" :value="permission.value" v-model="form.permissions" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <Label :for="permission.value" class="ml-2 text-sm text-gray-700">{{ permission.label }}</Label>
        </div>
      </div>
    </div>

    <div class="flex justify-between gap-4">
      <Button type="submit" class="flex-1 bg-blue-600 text-white hover:bg-blue-700">Add</Button>
      <Button type="button" variant="outline" class="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200" @click="emit('next')">Skip</Button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import Input from '~/components/ui/input'
import Label from '~/components/ui/label'
import Button from '~/components/ui/button'
import Select from '~/components/ui/select'
import SelectContent from '~/components/ui/select-content'
import SelectItem from '~/components/ui/select-item'
import SelectTrigger from '~/components/ui/select-trigger'
import SelectValue from '~/components/ui/select-value'
import Icon from '~/components/Icon.vue'

const emit = defineEmits(['next'])

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: 'user',
  permissions: []
})

const permissionsOptions = [
  { label: 'Property View', value: 'property.view' },
  { label: 'Accounting View', value: 'accounting.view' },
  { label: 'Security View', value: 'security.view' },
  { label: 'Shift View', value: 'shift.view' },
  { label: 'Portal View', value: 'portal.view' },
]

const handleSubmit = () => {
  console.log('Add User Form Submitted:', form.value)
  emit('next')
}
</script>
