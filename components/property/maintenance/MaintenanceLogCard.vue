<template>
    <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click', log)">
        <CardHeader>
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <Badge variant="outline" class="text-xs">{{ log.maintenanceNumber }}</Badge>
                        <StatusBadge :status="log.status" show-icon />
                        <PriorityBadge :priority="log.priority" />
                    </div>
                    <CardTitle class="text-lg">{{ log.title }}</CardTitle>
                    <CardDescription class="mt-1">{{ log.description }}</CardDescription>
                </div>
            </div>
        </CardHeader>

        <CardContent class="space-y-3">
            <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="flex items-center gap-2">
                    <Icon name="wrench" class="w-4 h-4 text-muted-foreground" />
                    <span class="text-muted-foreground">Type:</span>
                    <span class="font-medium">{{ log.maintenanceTypeDisplay }}</span>
                </div>

                <div class="flex items-center gap-2">
                    <Icon name="building" class="w-4 h-4 text-muted-foreground" />
                    <span class="text-muted-foreground">Property:</span>
                    <span class="font-medium">{{ log.propertyTypeDisplay }}</span>
                </div>

                <div class="flex items-center gap-2">
                    <Icon name="map-pin" class="w-4 h-4 text-muted-foreground" />
                    <span class="text-muted-foreground">Location:</span>
                    <span class="font-medium">{{ log.propertyLocation }}</span>
                </div>

                <div v-if="log.equipmentName" class="flex items-center gap-2">
                    <Icon name="tool" class="w-4 h-4 text-muted-foreground" />
                    <span class="text-muted-foreground">Equipment:</span>
                    <span class="font-medium">{{ log.equipmentName }}</span>
                </div>
            </div>

            <div v-if="log.performedBy || log.supervisedBy" class="flex items-center gap-4 text-sm pt-2 border-t">
                <div v-if="log.performedBy" class="flex items-center gap-2">
                    <Icon name="user" class="w-4 h-4 text-muted-foreground" />
                    <span class="text-muted-foreground">Performed by:</span>
                    <span class="font-medium">{{ log.performedBy.name }}</span>
                </div>

                <div v-if="log.supervisedBy" class="flex items-center gap-2">
                    <Icon name="user-check" class="w-4 h-4 text-muted-foreground" />
                    <span class="text-muted-foreground">Supervised by:</span>
                    <span class="font-medium">{{ log.supervisedBy.name }}</span>
                </div>
            </div>

            <div class="flex items-center justify-between text-sm pt-2 border-t">
                <div class="flex items-center gap-4">
                    <div v-if="log.scheduledDate" class="flex items-center gap-1 text-muted-foreground">
                        <Icon name="calendar" class="w-4 h-4" />
                        <span>{{ formatDate(log.scheduledDate) }}</span>
                    </div>

                    <div v-if="log.cost" class="flex items-center gap-1 text-muted-foreground">
                        <Icon name="dollar-sign" class="w-4 h-4" />
                        <span>{{ log.cost }}</span>
                    </div>

                    <div v-if="log.attachmentsCount > 0" class="flex items-center gap-1 text-muted-foreground">
                        <Icon name="paperclip" class="w-4 h-4" />
                        <span>{{ log.attachmentsCount }}</span>
                    </div>
                </div>

                <div v-if="log.isOverdue" class="flex items-center gap-1 text-red-600">
                    <Icon name="alert-circle" class="w-4 h-4" />
                    <span class="text-xs font-medium">Overdue</span>
                </div>
                <div v-else-if="log.isDueSoon" class="flex items-center gap-1 text-orange-600">
                    <Icon name="clock" class="w-4 h-4" />
                    <span class="text-xs font-medium">Due Soon</span>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import type { MaintenanceLog } from '~/types/maintenance'

interface Props {
    log: MaintenanceLog
}

defineProps<Props>()

defineEmits<{
    click: [log: MaintenanceLog]
}>()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>
