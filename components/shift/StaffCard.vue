<template>
    <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="$emit('view', staff)">
        <CardContent class="p-6">
            <div class="space-y-4">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h3 class="font-semibold text-lg">{{ staff.name }}</h3>
                        <Badge class="mt-1">{{ staff.staffTypeDisplay }}</Badge>
                    </div>
                    <Badge :variant="staff.isActive ? 'default' : 'secondary'">
                        {{ staff.isActive ? 'Active' : 'Inactive' }}
                    </Badge>
                </div>

                <div class="space-y-2 text-sm">
                    <div class="flex items-center gap-2 text-muted-foreground">
                        <Icon name="phone" class="w-4 h-4" />
                        <span>{{ staff.phoneNumber }}</span>
                    </div>
                    <div v-if="staff.email" class="flex items-center gap-2 text-muted-foreground">
                        <Icon name="mail" class="w-4 h-4" />
                        <span>{{ staff.email }}</span>
                    </div>
                    <div v-if="staff.employeeId" class="flex items-center gap-2 text-muted-foreground">
                        <Icon name="id-card" class="w-4 h-4" />
                        <span>{{ staff.employeeId }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-muted-foreground">
                        <Icon name="calendar" class="w-4 h-4" />
                        <span>{{ staff.assignedShiftsCount }} assigned shifts</span>
                    </div>
                </div>

                <div class="flex gap-2 pt-2" @click.stop>
                    <Button variant="outline" size="sm" class="flex-1" @click="$emit('edit', staff)">
                        <Icon name="edit" class="w-4 h-4 mr-1" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" class="flex-1" @click="$emit('toggle-active', staff)">
                        <Icon :name="staff.isActive ? 'user-x' : 'user-check'" class="w-4 h-4 mr-1" />
                        {{ staff.isActive ? 'Deactivate' : 'Activate' }}
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import type { Staff } from '~/types/shifts'

defineProps<{
    staff: Staff
}>()

defineEmits<{
    view: [staff: Staff]
    edit: [staff: Staff]
    toggleActive: [staff: Staff]
}>()
</script>
