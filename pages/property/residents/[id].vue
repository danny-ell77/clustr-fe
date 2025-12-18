<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button variant="ghost" size="sm" @click="goBack">
                    <Icon name="arrow-left" class="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 class="text-3xl font-semibold">Resident Details</h1>
                    <p class="text-muted-foreground">View resident information and payment history</p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <Button v-if="resident && !resident.approvedByAdmin" @click="handleApprove">
                    Approve Resident
                </Button>
                <Button variant="outline" @click="handleEdit">
                    <Icon name="edit" class="w-4 h-4 mr-2" />
                    Edit
                </Button>
            </div>
        </div>

        <div v-if="isLoading" class="space-y-6">
            <Card>
                <CardContent class="pt-6">
                    <Skeleton class="h-48 w-full" />
                </CardContent>
            </Card>
        </div>

        <div v-else-if="resident" class="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Resident Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex items-center gap-4">
                            <div v-if="resident.profileImageUrl" class="w-20 h-20 rounded-full overflow-hidden">
                                <img :src="resident.profileImageUrl" :alt="resident.name"
                                    class="w-full h-full object-cover" />
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

            <Card>
                <CardHeader>
                    <CardTitle>Bills Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div class="text-center p-4 bg-muted/50 rounded-lg">
                            <p class="text-2xl font-semibold">{{ resident.billsSummary.total }}</p>
                            <p class="text-sm text-muted-foreground">Total Bills</p>
                        </div>
                        <div class="text-center p-4 bg-green-50 rounded-lg">
                            <p class="text-2xl font-semibold text-green-600">{{ resident.billsSummary.paid }}</p>
                            <p class="text-sm text-muted-foreground">Paid</p>
                        </div>
                        <div class="text-center p-4 bg-red-50 rounded-lg">
                            <p class="text-2xl font-semibold text-red-600">{{ resident.billsSummary.unpaid }}</p>
                            <p class="text-sm text-muted-foreground">Unpaid</p>
                        </div>
                        <div class="text-center p-4 bg-yellow-50 rounded-lg">
                            <p class="text-2xl font-semibold text-yellow-600">{{ resident.billsSummary.pending }}</p>
                            <p class="text-sm text-muted-foreground">Pending</p>
                        </div>
                        <div class="text-center p-4 bg-orange-50 rounded-lg">
                            <p class="text-2xl font-semibold text-orange-600">{{ resident.billsSummary.overdue }}</p>
                            <p class="text-sm text-muted-foreground">Overdue</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Complete bill payment history for this resident</CardDescription>
                </CardHeader>
                <CardContent>
                    <BaseTable :loading="false" :is-empty="bills.length === 0" :column-count="8"
                        empty-message="No bills found for this resident">
                        <template #column-headers>
                            <TableHead>Bill Number</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Paid Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Paid Date</TableHead>
                            <TableHead>Status</TableHead>
                        </template>

                        <template #table-body>
                            <TableRow v-for="bill in bills" :key="bill.id">
                                <TableCell class="font-medium">{{ bill.billNumber }}</TableCell>
                                <TableCell>
                                    <div>
                                        <p class="font-medium">{{ bill.title }}</p>
                                        <p v-if="bill.description" class="text-sm text-muted-foreground">{{
                                            bill.description }}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{{ bill.type }}</Badge>
                                </TableCell>
                                <TableCell class="font-medium">
                                    {{ formatCurrency(bill.amount, bill.currency) }}
                                </TableCell>
                                <TableCell :class="bill.isFullyPaid ? 'text-green-600' : 'text-orange-600'">
                                    {{ formatCurrency(bill.paidAmount, bill.currency) }}
                                </TableCell>
                                <TableCell>
                                    <span v-if="bill.dueDate" :class="bill.isOverdue ? 'text-red-600' : ''">
                                        {{ formatDate(bill.dueDate) }}
                                    </span>
                                    <span v-else class="text-muted-foreground">-</span>
                                </TableCell>
                                <TableCell>
                                    <span v-if="bill.paidAt">{{ formatDate(bill.paidAt) }}</span>
                                    <span v-else class="text-muted-foreground">-</span>
                                </TableCell>
                                <TableCell>
                                    <Badge v-if="bill.isFullyPaid" variant="default">
                                        <Icon name="check-circle" class="w-3 h-3 mr-1" />
                                        Paid
                                    </Badge>
                                    <Badge v-else-if="bill.isOverdue" variant="destructive">
                                        <Icon name="alert-circle" class="w-3 h-3 mr-1" />
                                        Overdue
                                    </Badge>
                                    <Badge v-else variant="secondary">
                                        Unpaid
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        </template>
                    </BaseTable>
                </CardContent>
            </Card>
        </div>

        <ResidentFormDialog v-model:open="showEditDialog" :resident="resident as any" @success="onResidentUpdated" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'
import { TableHead, TableCell, TableRow } from '~/components/ui/table'
import Icon from '~/components/Icon.vue'
import BaseTable from '~/components/shared/BaseTable.vue'
import ResidentFormDialog from '~/components/property/residents/ResidentFormDialog.vue'
import { useResidents } from '~/composables/property/useResidents'

definePageMeta({
    title: 'Resident Details'
})

const route = useRoute()
const router = useRouter()

const residentId = computed(() => route.params.id as string)

const {
    useResident,
    updateApprovalStatusMutation
} = useResidents()

const residentQuery = useResident(residentId)

const resident = computed(() => residentQuery.data.value)
const bills = computed(() => resident.value?.bills || [])
const isLoading = computed(() => residentQuery.isLoading.value)

const showEditDialog = ref(false)

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

const formatCurrency = (amount: string, currency: string = 'NGN') => {
    const numAmount = parseFloat(amount)
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency
    }).format(numAmount)
}

const goBack = () => {
    router.push('/property/residents')
}

const handleEdit = () => {
    showEditDialog.value = true
}

const handleApprove = async () => {
    if (resident.value) {
        await updateApprovalStatusMutation.mutateAsync({
            id: resident.value.id,
            approved: true
        })
    }
}

const onResidentUpdated = () => {
    showEditDialog.value = false
}
</script>
