<template>
    <div class="space-y-6">
        <!-- Header -->
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
            <p class="text-gray-600 mt-1">Manage your application settings and preferences</p>
        </div>

        <!-- Settings Tabs -->
        <div class="bg-white rounded-lg shadow">
            <div class="border-b border-gray-200">
                <nav class="flex space-x-8 px-6" aria-label="Tabs">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                        class="py-4 px-1 border-b-2 font-medium text-sm" :class="activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                        <Icon :name="tab.icon" class="w-4 h-4 mr-2 inline" />
                        {{ tab.label }}
                    </button>
                </nav>
            </div>

            <div class="p-6">
                <!-- General Settings -->
                <div v-if="activeTab === 'general'" class="space-y-6">
                    <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label for="orgName">Organization Name</Label>
                                <Input id="orgName" v-model="settings.organizationName" />
                            </div>
                            <div>
                                <Label for="timezone">Timezone</Label>
                                <DynamicSelect 
                                    v-model="settings.timezone"
                                    :options="timezoneOptions"
                                    placeholder="Select timezone"
                                    id="timezone"
                                />
                            </div>
                            <div>
                                <Label for="language">Language</Label>
                                <DynamicSelect 
                                    v-model="settings.language"
                                    :options="languageOptions"
                                    placeholder="Select language"
                                    id="language"
                                />
                            </div>
                            <div>
                                <Label for="dateFormat">Date Format</Label>
                                <DynamicSelect 
                                    v-model="settings.dateFormat"
                                    :options="dateFormatOptions"
                                    placeholder="Select date format"
                                    id="dateFormat"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Management -->
                <div v-if="activeTab === 'users'" class="space-y-6">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-medium text-gray-900">User Management</h3>
                        <Button @click="showAddUser = true">
                            <Icon name="plus" class="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status
                                    </th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <Avatar class="w-8 h-8 mr-3">
                                                <AvatarFallback>{{ user.name.charAt(0) }}</AvatarFallback>
                                            </Avatar>
                                            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="outline" class="capitalize">{{ user.role }}</Badge>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <Badge :variant="user.status === 'active' ? 'default' : 'secondary'">
                                            {{ user.status }}
                                        </Badge>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Icon name="edit" class="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" class="text-red-600">
                                                <Icon name="trash" class="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Notifications -->
                <div v-if="activeTab === 'notifications'" class="space-y-6">
                    <h3 class="text-lg font-medium text-gray-900">Notification Preferences</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <Label class="text-base font-medium">Email Notifications</Label>
                                <p class="text-sm text-gray-500">Receive notifications via email</p>
                            </div>
                            <input type="checkbox" v-model="settings.emailNotifications" class="rounded" />
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <Label class="text-base font-medium">Maintenance Alerts</Label>
                                <p class="text-sm text-gray-500">Get notified about maintenance updates</p>
                            </div>
                            <input type="checkbox" v-model="settings.maintenanceAlerts" class="rounded" />
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <Label class="text-base font-medium">Meeting Reminders</Label>
                                <p class="text-sm text-gray-500">Receive meeting reminder notifications</p>
                            </div>
                            <input type="checkbox" v-model="settings.meetingReminders" class="rounded" />
                        </div>
                    </div>
                </div>

                <!-- Security -->
                <div v-if="activeTab === 'security'" class="space-y-6">
                    <h3 class="text-lg font-medium text-gray-900">Security Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <Label for="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                        </div>
                        <div>
                            <Label for="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                        </div>
                        <div>
                            <Label for="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" />
                        </div>
                        <Button>Update Password</Button>
                    </div>
                </div>
            </div>

            <!-- Save Button -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <Button @click="saveSettings" class="bg-blue-600 hover:bg-blue-700">
                    Save Changes
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import DynamicSelect from '~/components/shared/DynamicSelect.vue'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import Icon from '~/components/Icon.vue'
import { useToast } from '~/composables/useToast'
import { useSuccessModal } from '~/composables/useSuccessModal'

definePageMeta({
    title: 'Settings',
    description: 'Application settings and preferences'
})

const activeTab = ref('general')
const showAddUser = ref(false)

const tabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'security', label: 'Security', icon: 'shield' }
]

// Options for DynamicSelect components
// Object format with name/value pairs for better display
const timezoneOptions = [
    { name: 'UTC', value: 'UTC' },
    { name: 'Eastern Time', value: 'America/New_York' },
    { name: 'Central Time', value: 'America/Chicago' },
    { name: 'Mountain Time', value: 'America/Denver' },
    { name: 'Pacific Time', value: 'America/Los_Angeles' }
]

const languageOptions = [
    { name: 'English', value: 'en' },
    { name: 'Spanish', value: 'es' },
    { name: 'French', value: 'fr' }
]

// String array format - simpler when display and value are the same
const dateFormatOptions = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']

const settings = ref({
    organizationName: 'ClustR Property Management',
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    emailNotifications: true,
    maintenanceAlerts: true,
    meetingReminders: true
})

const users = ref([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'manager', status: 'active' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'maintenance', status: 'inactive' }
])

const { error } = useToast()
const { showDataSaved } = useSuccessModal()

const saveSettings = () => {
    try {
        console.log('Saving settings:', settings.value)
        // TODO: Implement actual settings save API call
        showDataSaved()
    } catch (err) {
        error('Save Failed', 'There was an error saving your settings. Please try again.')
    }
}
</script>