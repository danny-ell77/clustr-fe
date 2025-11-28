<template>
    <div v-if="hasActiveAlerts" class="relative">
        <button @click="handleClick" class="relative p-2 rounded-lg transition-all duration-200" :class="[
            hasCriticalAlerts
                ? 'bg-red-100 hover:bg-red-200 text-red-600'
                : 'bg-orange-100 hover:bg-orange-200 text-orange-600'
        ]" :title="`${activeAlerts.length} active ${activeAlerts.length === 1 ? 'emergency' : 'emergencies'}`">
            <Icon name="bell-ring" :class="hasCriticalAlerts ? 'w-5 h-5 animate-pulse' : 'w-5 h-5'" />

            <span
                class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full"
                :class="[
                    hasCriticalAlerts ? 'bg-red-600 animate-pulse' : 'bg-orange-600'
                ]">
                {{ activeAlerts.length }}
            </span>
        </button>

        <div v-if="showDropdown"
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div class="p-3 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">Active Emergencies</h3>
                    <button @click="showDropdown = false" class="text-gray-400 hover:text-gray-600">
                        <Icon name="x" class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div class="max-h-96 overflow-y-auto">
                <div v-for="alert in activeAlerts" :key="alert.id" @click="viewAlert(alert)"
                    class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-1">
                                <span class="px-2 py-0.5 rounded text-xs font-medium"
                                    :class="getPriorityClass(alert.priority)">
                                    {{ alert.priorityDisplay }}
                                </span>
                                <span class="text-xs text-gray-500">{{ alert.emergencyTypeDisplay }}</span>
                            </div>
                            <p class="text-sm font-medium text-gray-900">{{ alert.userDetails?.name }}</p>
                            <p class="text-xs text-gray-600 mt-1">{{ alert.location || 'Location not specified' }}</p>
                            <p class="text-xs text-gray-500 mt-1">{{ formatTime(alert.createdAt) }}</p>
                        </div>
                        <Icon name="chevron-right" class="w-4 h-4 text-gray-400 mt-1" />
                    </div>
                </div>
            </div>

            <div class="p-3 border-t border-gray-200">
                <Button @click="viewAllEmergencies" variant="outline" size="sm" class="w-full">
                    View All Emergencies
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEmergencyAlerts } from '~/composables/useEmergencyAlerts'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import type { EmergencyAlert } from '~/services/api/emergency.api'

const { activeAlerts, hasActiveAlerts, hasCriticalAlerts } = useEmergencyAlerts()
const showDropdown = ref(false)

const handleClick = () => {
    if (activeAlerts.value.length === 1) {
        viewAlert(activeAlerts.value[0])
    } else {
        showDropdown.value = !showDropdown.value
    }
}

const viewAlert = (alert: EmergencyAlert) => {
    showDropdown.value = false
    navigateTo(`/portal/emergency/${alert.id}`)
}

const viewAllEmergencies = () => {
    showDropdown.value = false
    navigateTo('/portal/emergency')
}

const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    return date.toLocaleDateString()
}

const getPriorityClass = (priority: string) => {
    const classes = {
        low: 'bg-gray-100 text-gray-800',
        medium: 'bg-primary/15 text-primary',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800'
    }
    return classes[priority as keyof typeof classes] || classes.high
}
</script>
