<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button variant="ghost" size="icon" @click="navigateTo('/security/children')">
                    <Icon name="arrow-left" class="w-5 h-5" />
                </Button>
                <div>
                    <h1 class="text-3xl font-semibold">{{ child?.name || 'Child Details' }}</h1>
                    <p class="text-muted-foreground">View and manage child profile</p>
                </div>
            </div>

            <div class="flex gap-2">
                <Button variant="outline" @click="showEditModal = true" :disabled="!child">
                    <Icon name="edit" class="w-4 h-4 mr-2" />
                    Edit Profile
                </Button>
                <Button @click="showExitRequestModal = true" :disabled="!child">
                    <Icon name="log-out" class="w-4 h-4 mr-2" />
                    Request Exit
                </Button>
            </div>
        </div>

        <div v-if="childQuery.isLoading.value" class="space-y-6">
            <Card>
                <CardContent class="pt-6">
                    <Skeleton class="h-64 w-full" />
                </CardContent>
            </Card>
        </div>

        <div v-else-if="child" class="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="flex items-start gap-6">
                        <Avatar class="w-24 h-24">
                            <AvatarImage v-if="child.profilePhoto" :src="child.profilePhoto" :alt="child.name" />
                            <AvatarFallback class="text-2xl">{{ getInitials(child.name) }}</AvatarFallback>
                        </Avatar>
                        <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label class="text-muted-foreground">Full Name</Label>
                                <p class="font-medium">{{ child.name }}</p>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">Age</Label>
                                <p class="font-medium">{{ child.age }} years old</p>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">Date of Birth</Label>
                                <p class="font-medium">{{ formatDate(child.dateOfBirth) }}</p>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">Gender</Label>
                                <p class="font-medium">{{ formatGender(child.gender) }}</p>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">House Number</Label>
                                <p class="font-medium">{{ child.houseNumber }}</p>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">Status</Label>
                                <Badge :variant="child.isActive ? 'default' : 'destructive'">
                                    {{ child.isActive ? 'Active' : 'Inactive' }}
                                </Badge>
                            </div>
                            <div class="col-span-2">
                                <Label class="text-muted-foreground">Parent/Guardian</Label>
                                <p class="font-medium">{{ child.parentName }}</p>
                            </div>
                            <div v-if="child.notes" class="col-span-2">
                                <Label class="text-muted-foreground">Notes</Label>
                                <p class="font-medium">{{ child.notes }}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div v-if="child.emergencyContacts.length" class="space-y-4">
                        <div v-for="(contact, index) in child.emergencyContacts" :key="index"
                            class="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p class="font-medium">{{ contact.name }}</p>
                                <p class="text-sm text-muted-foreground">{{ contact.relationship }}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-medium">{{ contact.phone }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-muted-foreground">
                        No emergency contacts added
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <CardTitle>Entry/Exit Logs</CardTitle>
                        <Button variant="outline" size="sm" @click="showCheckInOutModal = true">
                            <Icon name="log-in" class="w-4 h-4 mr-2" />
                            Check In/Out
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div v-if="logsQuery.isLoading.value" class="space-y-4">
                        <Skeleton v-for="i in 3" :key="i" class="h-20 w-full" />
                    </div>
                    <div v-else-if="logs.length" class="space-y-4">
                        <div v-for="log in logs" :key="log.id"
                            class="flex items-start justify-between p-4 border rounded-lg">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <Badge :variant="log.logType === 'EXIT' ? 'destructive' : 'default'">
                                        {{ log.logType }}
                                    </Badge>
                                    <Badge :variant="getStatusVariant(log.status)">
                                        {{ log.status }}
                                    </Badge>
                                    <Badge v-if="log.isOverdue" variant="destructive">
                                        Overdue
                                    </Badge>
                                </div>
                                <p class="font-medium">{{ log.reason }}</p>
                                <p class="text-sm text-muted-foreground">Destination: {{ log.destination }}</p>
                                <p class="text-sm text-muted-foreground">With: {{ log.accompanyingAdult }}</p>
                                <div class="flex gap-4 mt-2 text-sm">
                                    <span v-if="log.exitTime">Exit: {{ formatDateTime(log.exitTime) }}</span>
                                    <span v-if="log.entryTime">Entry: {{ formatDateTime(log.entryTime) }}</span>
                                    <span v-if="log.expectedReturnTime">Expected: {{
                                        formatDateTime(log.expectedReturnTime) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-muted-foreground">
                        No entry/exit logs found
                    </div>
                </CardContent>
            </Card>
        </div>

        <div v-else class="flex items-center justify-center py-12">
            <EmptyState title="Child not found" description="The child profile you're looking for doesn't exist"
                action-label="Back to Children" @action="navigateTo('/security/children')" />
        </div>

        <ChildFormDialog v-model:open="showEditModal" :child="child" @success="onChildUpdated" />

        <CheckInOutDialog v-model:open="showCheckInOutModal" :child="child" @success="onCheckInOutSuccess" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useChildren } from '~/composables/security/useChildren'
import ChildFormDialog from '~/components/security/children/ChildFormDialog.vue'
import CheckInOutDialog from '~/components/security/children/CheckInOutDialog.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'

definePageMeta({
    layout: 'default'
})

const route = useRoute()
const childId = computed(() => route.params.id as string)

const { useChild, useChildEntryExitLogs } = useChildren()

const childQuery = useChild(childId)
const logsQuery = useChildEntryExitLogs(childId)

const child = computed(() => childQuery.data.value)
const logs = computed(() => logsQuery.data.value || [])

const showEditModal = ref(false)
const showExitRequestModal = ref(false)
const showCheckInOutModal = ref(false)

const onChildUpdated = () => {
    showEditModal.value = false
}

const onCheckInOutSuccess = () => {
    showCheckInOutModal.value = false
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}

const formatGender = (gender: string) => {
    return gender.charAt(0) + gender.slice(1).toLowerCase()
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return 'default'
        case 'PENDING':
            return 'secondary'
        case 'OVERDUE':
            return 'destructive'
        default:
            return 'secondary'
    }
}
</script>
