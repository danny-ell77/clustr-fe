<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <h2 class="text-2xl text-gray-900 mb-4">Add Team Members</h2>

    <div v-for="(user, index) in users" :key="index" class="space-y-6 p-4 border rounded-lg">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">Team Member {{ index + 1 }}</h3>
        <Button v-if="users.length > 1" variant="ghost" size="sm" @click="removeUser(index)">
          <Icon name="x" class="w-4 h-4" />
        </Button>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="relative">
          <Input :id="'first-name-' + index" v-model="user.firstName.value" placeholder="First Name"
            :error="user.firstName.errors[0]" :touched="user.firstName.isTouched" @blur="user.firstName.setTouched()"
            class="pl-9" />
          <Icon name="user" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        <div class="relative">
          <Input :id="'last-name-' + index" v-model="user.lastName.value" placeholder="Last Name"
            :error="user.lastName.errors[0]" :touched="user.lastName.isTouched" @blur="user.lastName.setTouched()"
            class="pl-9" />
          <Icon name="user" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        <div class="relative md:col-span-2">
          <Input :id="'email-' + index" v-model="user.email.value" type="email" placeholder="Email"
            :error="user.email.errors[0]" :touched="user.email.isTouched" @blur="user.email.setTouched()"
            class="pl-9" />
          <Icon name="mail" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        <div class="md:col-span-2">
          <Label :for="'role-' + index" class="block text-sm font-medium text-gray-700 mb-1">Role</Label>
          <Select v-model="user.role.value" @blur="user.role.setTouched()" @update:modelValue="handleRoleChange(index)">
            <SelectTrigger :class="{ 'border-red-500': user.role.errors.length > 0 && user.role.isTouched }">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="role in roleOptions" :key="role.value" :value="role.value">
                {{ role.label }}
              </SelectItem>
              <SelectItem value="custom">Custom Permissions</SelectItem>
            </SelectContent>
          </Select>
          <FormError v-if="user.role.isTouched" :error="user.role.errors[0]" />
        </div>

        <div v-if="user.role.value === 'custom'" class="md:col-span-2 space-y-4">
          <Label class="block text-sm font-medium text-gray-700">Permissions</Label>

          <div v-for="(perms, group) in permissionGroups" :key="group" class="space-y-2">
            <h4 class="font-medium text-sm text-gray-600">{{ group }}</h4>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="perm in perms" :key="perm.value" class="flex items-center">
                <Checkbox :id="'perm-' + index + '-' + perm.value"
                  :checked="user.permissions.value.includes(perm.value)" @update:checked="(checked: boolean) => {
                    if (checked) {
                      user.permissions.value = [...user.permissions.value, perm.value]
                    } else {
                      user.permissions.value = user.permissions.value.filter((p: string) => p !== perm.value)
                    }
                  }" @blur="user.permissions.setTouched()" />
                <Label :for="'perm-' + index + '-' + perm.value" class="ml-2 text-sm">
                  {{ perm.label }}
                </Label>
              </div>
            </div>
          </div>

          <FormError v-if="user.permissions.isTouched" :error="user.permissions.errors[0]" />
        </div>
      </div>
    </div>

    <Button type="button" variant="outline" class="w-full" @click="addUser">
      <Icon name="plus" class="w-4 h-4 mr-2" />
      Add Another Team Member
    </Button>

    <div class="flex justify-between gap-4">
      <Button type="button" variant="outline" class="flex-1" @click="emit('next')">
        Skip for now
      </Button>
      <Button type="submit" class="flex-1" :variant="isFormValid ? 'default' : 'secondary'"
        :disabled="!isFormValid || isLoading">
        {{ isLoading ? 'Adding...' : 'Continue' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, unref } from 'vue'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { FormError } from '~/components/ui/form'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import Icon from '~/components/Icon.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useFieldValidation } from '~/composables/useFieldValidation'
import { PERMISSIONS, ROLES } from '~/composables/auth/usePermissions'
import { rules } from '~/utils/validators'
import { usersApi } from '~/services/api/users.api'
import { queryKeys } from '~/constants/query-keys'

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'skip'): void
}>()

const queryClient = useQueryClient()
const toast = useToast()

const addStaffMutation = useMutation({
  mutationFn: (staffData: any) => usersApi.addStaff(staffData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    toast.success('Staff added successfully')
  },
  onError: (error: any) => {
    toast.error(error.message || 'Failed to add staff')
  }
})

const isLoading = computed(() => addStaffMutation.isPending.value)

const createUserForm = () => ({
  firstName: useFieldValidation<string>('', [
    rules.required('First name is required'),
    rules.name('Please enter a valid name'),
    rules.maxLength(30, 'Name cannot exceed 30 characters')
  ]),
  lastName: useFieldValidation<string>('', [
    rules.required('Last name is required'),
    rules.name('Please enter a valid name'),
    rules.maxLength(30, 'Name cannot exceed 30 characters')
  ]),
  email: useFieldValidation<string>('', [
    rules.required('Email is required'),
    rules.email('Please enter a valid email address')
  ]),
  role: useFieldValidation<string>('', [
    rules.required('Please select a role')
  ]),
  permissions: useFieldValidation<string[]>([], [
    rules.custom(
      (value) => value.length > 0,
      'Please select at least one permission'
    )
  ])
})

const roleOptions = [
  { label: 'Security', value: 'Security', permissions: [...ROLES.SECURITY.permissions] },
  { label: 'Facility Manager', value: 'Facility_Manager', permissions: [...ROLES.FACILITY_MANAGER.permissions] },
  { label: 'Communications Officer', value: 'Communications_Officer', permissions: [...ROLES.COMMUNICATIONS_OFFICER.permissions] },
  { label: 'Finance Officer', value: 'Finance_Officer', permissions: [...ROLES.FINANCE_OFFICER.permissions] }
]

const permissionGroups = {
  'Access Control': Object.entries(PERMISSIONS.ACCESS_CONTROL).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Accounts': Object.entries(PERMISSIONS.ACCOUNTS).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Communications': Object.entries(PERMISSIONS.COMMUNICATIONS).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Security': Object.entries(PERMISSIONS.SECURITY).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Facility Admin': Object.entries(PERMISSIONS.FACILITY_ADMIN).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Payments': Object.entries(PERMISSIONS.PAYMENTS).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Documentation': Object.entries(PERMISSIONS.DOCUMENTATION).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Marketplace': Object.entries(PERMISSIONS.MARKETPLACE).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Notifications': Object.entries(PERMISSIONS.NOTIFICATIONS).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Staff Tracker': Object.entries(PERMISSIONS.STAFF_TRACKER).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Admin': Object.entries(PERMISSIONS.ADMIN).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  })),
  'Profile': Object.entries(PERMISSIONS.PROFILE).map(([key, value]) => ({
    label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value
  }))
}

type UserForm = ReturnType<typeof createUserForm>

const users = ref<UserForm[]>([createUserForm()])

const addUser = () => {
  users.value.push(createUserForm())
}

const removeUser = (index: number) => {
  users.value.splice(index, 1)
}

const handleRoleChange = (index: number) => {
  const user = users.value[index]
  const selectedRole = roleOptions.find(r => r.value === unref(user.role.value))

  if (selectedRole && selectedRole.value !== 'custom') {
    user.permissions.setValue(selectedRole.permissions)
  } else {
    user.permissions.setValue([])
  }
}

const isFormValid = computed(() => {
  return users.value.every(user =>
    unref(user.firstName.isValid) &&
    unref(user.lastName.isValid) &&
    unref(user.email.isValid) &&
    unref(user.role.isValid) &&
    unref(user.permissions.isValid)
  )
})

const handleSubmit = async () => {
  users.value.forEach(user => {
    user.firstName.setTouched()
    user.lastName.setTouched()
    user.email.setTouched()
    user.role.setTouched()
    user.permissions.setTouched()
  })

  if (!isFormValid.value) return

  try {
    await Promise.all(users.value.map(user => addStaffMutation.mutateAsync({
      name: `${unref(user.firstName.value)} ${unref(user.lastName.value)}`,
      emailAddress: unref(user.email.value),
      phoneNumber: '',
      permissions: unref(user.permissions.value)
    })))

    emit('next')
  } catch (error) {
    console.error('Failed to create users:', error)
  }
}
</script>
