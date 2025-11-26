<template>
    <div v-if="hasCriticalAlerts" class="bg-red-600 text-white">
        <div class="px-6 py-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-2">
                        <Icon name="alert-triangle" class="w-5 h-5 animate-pulse" />
                        <span class="font-bold text-sm uppercase tracking-wide">Emergency Alert</span>
                    </div>
                    <div class="h-4 w-px bg-red-400"></div>
                    <div class="text-sm">
                        <span class="font-semibold">{{ criticalAlerts.length }}</span>
                        {{ criticalAlerts.length === 1 ? 'critical emergency' : 'critical emergencies' }} requiring
                        immediate attention
                    </div>
                </div>

                <div class="flex items-center space-x-3">
                    <Button size="sm" variant="outline" class="bg-white text-red-600 hover:bg-red-50 border-white"
                        @click="viewEmergencies">
                        View All Emergencies
                    </Button>
                    <button @click="dismiss" class="text-white hover:text-red-100 transition-colors"
                        aria-label="Dismiss">
                        <Icon name="x" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div v-if="mostUrgentAlert" class="mt-2 pl-8 text-sm">
                <div class="flex items-center space-x-2">
                    <span class="font-medium">Most Urgent:</span>
                    <span>{{ mostUrgentAlert.emergencyTypeDisplay }}</span>
                    <span class="text-red-200">•</span>
                    <span>{{ mostUrgentAlert.location || 'Location not specified' }}</span>
                    <span class="text-red-200">•</span>
                    <span>{{ mostUrgentAlert.userDetails?.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEmergencyAlerts } from '~/composables/useEmergencyAlerts'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

const { criticalAlerts, hasCriticalAlerts, mostUrgentAlert } = useEmergencyAlerts()
const isDismissed = ref(false)

const dismiss = () => {
    isDismissed.value = true
}

const viewEmergencies = () => {
    navigateTo('/portal/emergency')
}
</script>
