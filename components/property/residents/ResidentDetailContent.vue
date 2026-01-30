<template>
    <Card>
        <CardHeader>
            <CardTitle>Resident Information</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex items-center gap-4">
                    <div v-if="resident.profileImageUrl" class="w-20 h-20 rounded-full overflow-hidden">
                        <img :src="resident.profileImageUrl" :alt="resident.name" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <span class="text-2xl font-medium text-primary">{{ getInitials(resident.name) }}</span>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold">{{ resident.name }}</h3>
                        <div class="flex items-center gap-2 mt-1">
                            <Badge :variant="resident.approvedByAdmin ? 'default' : 'secondary'">
                                {{ resident.approvedByAdmin ? 'Approved' : 'Pending' }}
                            </Badge>
                            <Badge v-if="resident.isVerified" variant="outline">
                                <Icon name="check-circle" class="w-3 h-3 mr-1" />
                                Verified
                            </Badge>
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <div>
                        <Label class="text-muted-foreground">Email</Label>
                        <p class="font-medium">{{ resident.emailAddress }}</p>
                    </div>
                    <div>
                        <Label class="text-muted-foreground">Phone</Label>
                        <p class="font-medium">{{ resident.phoneNumber }}</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <div>
                        <Label class="text-muted-foreground">Unit Address</Label>
                        <p class="font-medium">{{ resident.unitAddress || '-' }}</p>
                    </div>
                    <div>
                        <Label class="text-muted-foreground">Property Type</Label>
                        <p class="font-medium">{{ resident.propertyType || '-' }}</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <div>
                        <Label class="text-muted-foreground">Apartment Status</Label>
                        <Badge :variant="resident.apartmentStatus === 'OCCUPIED' ? 'default' : 'outline'">
                            {{ resident.apartmentStatus }}
                        </Badge>
                    </div>
                    <div>
                        <Label class="text-muted-foreground">Date Joined</Label>
                        <p class="font-medium">{{ formatDate(resident.dateJoined) }}</p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import type { Resident } from '~/types/residents'

/**
 * Resident detail content component for displaying resident information.
 */

defineProps<{
    resident: Resident
}>()

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>
