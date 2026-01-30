<template>
    <Card class="border-red-200 bg-red-50">
        <CardHeader>
            <CardTitle class="text-red-800">Active Alerts ({{ alertCount }})</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="space-y-2">
                <div v-for="alert in alerts" :key="alert.id"
                    class="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div class="flex items-center space-x-3">
                        <Icon name="alert-circle" class="w-5 h-5 text-red-600" />
                        <div>
                            <div class="font-medium">{{ alert.emergencyTypeDisplay }}</div>
                            <div class="text-sm text-muted-foreground">
                                {{ alert.userDetails?.name }} - {{ alert.location }}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span :class="getPriorityClass(alert.priority)" class="px-2 py-1 rounded text-xs font-medium">
                            {{ alert.priorityDisplay }}
                        </span>
                        <Button size="sm" @click="$emit('view', alert)">View</Button>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import type { EmergencyAlert } from '~/services/api/emergency.api'

interface Props {
    alerts: EmergencyAlert[]
}

const props = defineProps<Props>()

const alertCount = computed(() => props.alerts.length)

defineEmits<{
    view: [alert: EmergencyAlert]
}>()

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
