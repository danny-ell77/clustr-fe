<template>
    <div class="max-w-4xl mx-auto space-y-6 p-6">
        <div class="text-center">
            <Icon name="check-circle" class="w-16 h-16 mx-auto text-primary mb-4" />
            <h1 class="text-3xl font-semibold">Verify Visitor</h1>
            <p class="text-muted-foreground mt-2">
                Scan QR code or enter access code to verify and check in visitors
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Scan QR Code</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <div class="text-center space-y-4">
                            <Icon name="qr-code" class="w-24 h-24 mx-auto text-muted-foreground" />
                            <p class="text-sm text-muted-foreground">QR Scanner</p>
                            <Button variant="outline" @click="startQrScan">
                                <Icon name="camera" class="w-4 h-4 mr-2" />
                                Start Scanner
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Manual Entry</CardTitle>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="verifyAccessCode" class="space-y-4">
                        <div>
                            <Label for="code">Access Code</Label>
                            <Input id="code" v-model="accessCode" placeholder="Enter 6-digit code" maxlength="6"
                                class="text-center text-2xl tracking-widest font-mono" :disabled="isVerifying" />
                        </div>

                        <Button type="submit" class="w-full" :disabled="isVerifying || !accessCode">
                            {{ isVerifying ? 'Verifying...' : 'Verify Code' }}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>

        <Card v-if="visitor">
            <CardHeader>
                <div class="flex items-center justify-between">
                    <CardTitle>Visitor Details</CardTitle>
                    <StatusBadge :status="visitor.status" />
                </div>
            </CardHeader>
            <CardContent>
                <div class="space-y-6">
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <Label>Full Name</Label>
                            <p class="text-lg font-medium mt-1">{{ visitor.name }}</p>
                        </div>
                        <div>
                            <Label>Phone Number</Label>
                            <p class="text-lg font-medium mt-1">{{ visitor.phone }}</p>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <p class="text-lg font-medium mt-1">{{ visitor.email || 'N/A' }}</p>
                        </div>
                        <div>
                            <Label>Host</Label>
                            <p class="text-lg font-medium mt-1">{{ visitor.invitedBy }}</p>
                        </div>
                        <div>
                            <Label>Visit Type</Label>
                            <p class="text-lg font-medium mt-1">{{ formatVisitType(visitor.visitType) }}</p>
                        </div>
                        <div>
                            <Label>Expected Arrival</Label>
                            <p class="text-lg font-medium mt-1">{{ formatDateTime(visitor.estimatedArrival) }}</p>
                        </div>
                        <div>
                            <Label>Valid Until</Label>
                            <p class="text-lg font-medium mt-1" :class="{ 'text-red-600': isExpired }">
                                {{ formatDate(visitor.validDate) }}
                            </p>
                        </div>
                        <div>
                            <Label>Access Code</Label>
                            <p class="text-lg font-medium font-mono mt-1">{{ visitor.accessCode }}</p>
                        </div>
                    </div>

                    <div v-if="visitor.purpose">
                        <Label>Purpose of Visit</Label>
                        <p class="text-sm text-muted-foreground mt-1">{{ visitor.purpose }}</p>
                    </div>

                    <div v-if="visitor.notes">
                        <Label>Additional Notes</Label>
                        <p class="text-sm text-muted-foreground mt-1">{{ visitor.notes }}</p>
                    </div>

                    <div v-if="canCheckIn || canCheckOut" class="pt-4 border-t">
                        <div class="space-y-4">
                            <div>
                                <Label for="checkNotes">Security Notes (Optional)</Label>
                                <Textarea id="checkNotes" v-model="checkNotes"
                                    placeholder="Add any observations or notes" rows="3" />
                            </div>

                            <div class="flex gap-3">
                                <Button v-if="canCheckIn" @click="handleCheckIn" :disabled="isProcessing"
                                    class="flex-1">
                                    <Icon name="user-check" class="w-4 h-4 mr-2" />
                                    {{ isProcessing ? 'Processing...' : 'Check In' }}
                                </Button>
                                <Button v-if="canCheckOut" @click="handleCheckOut" :disabled="isProcessing"
                                    variant="outline" class="flex-1">
                                    <Icon name="user-x" class="w-4 h-4 mr-2" />
                                    {{ isProcessing ? 'Processing...' : 'Check Out' }}
                                </Button>
                                <Button variant="outline" @click="reset">
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="visitor.status === 'PENDING'" class="bg-yellow-50 p-4 rounded-lg">
                        <div class="flex items-start gap-2">
                            <Icon name="alert-triangle" class="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                                <p class="font-medium text-yellow-900">Pending Approval</p>
                                <p class="text-sm text-yellow-700 mt-1">
                                    This visitor has not been approved yet. Contact the host for approval.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="visitor.status === 'REJECTED'" class="bg-red-50 p-4 rounded-lg">
                        <div class="flex items-start gap-2">
                            <Icon name="x-circle" class="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <p class="font-medium text-red-900">Access Denied</p>
                                <p class="text-sm text-red-700 mt-1">
                                    This visitor has been rejected and cannot enter the estate.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="visitor.status === 'EXPIRED'" class="bg-red-50 p-4 rounded-lg">
                        <div class="flex items-start gap-2">
                            <Icon name="alert-triangle" class="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <p class="font-medium text-red-900">Expired Access</p>
                                <p class="text-sm text-red-700 mt-1">
                                    This visitor's access has expired. They need a new invitation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card v-if="recentActivity.length > 0">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="space-y-3">
                    <div v-for="activity in recentActivity" :key="activity.id"
                        class="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div class="flex items-center gap-3">
                            <Icon :name="getActivityIcon(activity.status)" class="w-5 h-5" />
                            <div>
                                <p class="font-medium">{{ activity.name }}</p>
                                <p class="text-sm text-muted-foreground">{{ activity.accessCode }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <StatusBadge :status="activity.status" />
                            <p class="text-xs text-muted-foreground mt-1">
                                {{ formatTime(activity.lastModifiedAt) }}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import StatusBadge from '~/components/common/StatusBadge.vue'
import Icon from '~/components/Icon.vue'
import { useVisitors } from '~/composables/security/useVisitors'
import type { Visitor } from '~/types/visitors'

definePageMeta({
    title: 'Verify Visitor',
    requiresPermission: 'security.visitors.verify'
})

const { checkInMutation, checkOutMutation, useActiveVisitors } = useVisitors()
const toast = useToast()

const accessCode = ref('')
const visitor = ref<Visitor | null>(null)
const checkNotes = ref('')
const isVerifying = ref(false)
const isProcessing = ref(false)

const activeVisitorsQuery = useActiveVisitors()
const recentActivity = computed(() => {
    const visitors = activeVisitorsQuery.data.value || []
    return visitors.slice(0, 5)
})

const isExpired = computed(() => {
    if (!visitor.value) return false
    return new Date(visitor.value.validDate) < new Date()
})

const canCheckIn = computed(() => {
    return visitor.value && visitor.value.status === 'APPROVED'
})

const canCheckOut = computed(() => {
    return visitor.value && visitor.value.status === 'CHECKED_IN'
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}

const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })
}

const formatVisitType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
}

const getActivityIcon = (status: string) => {
    const iconMap: Record<string, string> = {
        CHECKED_IN: 'user-check',
        CHECKED_OUT: 'user-x',
        APPROVED: 'check-circle',
        PENDING: 'clock'
    }
    return iconMap[status] || 'user'
}

const verifyAccessCode = async () => {
    if (!accessCode.value) return

    isVerifying.value = true
    try {
        const { $api } = useNuxtApp()
        const response = await $api<Visitor>('/management/visitors/verify_access_code/', {
            method: 'POST',
            body: { access_code: accessCode.value }
        })
        visitor.value = response
        toast.success('Visitor verified successfully')
    } catch (error: any) {
        toast.error('Verification failed', error.data?.message || 'Invalid access code')
        visitor.value = null
    } finally {
        isVerifying.value = false
    }
}

const handleCheckIn = async () => {
    if (!visitor.value) return

    isProcessing.value = true
    try {
        await checkInMutation.mutateAsync({
            id: visitor.value.id,
            notes: checkNotes.value || undefined
        })
        reset()
    } catch (error) {
        console.error('Check in failed:', error)
    } finally {
        isProcessing.value = false
    }
}

const handleCheckOut = async () => {
    if (!visitor.value) return

    isProcessing.value = true
    try {
        await checkOutMutation.mutateAsync({
            id: visitor.value.id,
            notes: checkNotes.value || undefined
        })
        reset()
    } catch (error) {
        console.error('Check out failed:', error)
    } finally {
        isProcessing.value = false
    }
}

const startQrScan = () => {
    toast.info('QR Scanner', 'QR code scanning will be implemented soon')
}

const reset = () => {
    accessCode.value = ''
    visitor.value = null
    checkNotes.value = ''
}
</script>
