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
            <ResidentDetailContent :resident="resident" />

            <ResidentBillsSummary :summary="resident.billsSummary" />

            <ResidentBillsTable :bills="bills" />
        </div>

        <ResidentFormDialog v-model:open="showEditDialog" :resident="resident as any" @success="onResidentUpdated" />
    </div>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'
import ResidentDetailContent from '~/components/property/residents/ResidentDetailContent.vue'
import ResidentBillsSummary from '~/components/property/residents/ResidentBillsSummary.vue'
import ResidentBillsTable from '~/components/property/residents/ResidentBillsTable.vue'
import ResidentFormDialog from '~/components/property/residents/ResidentFormDialog.vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { useResidents } from '~/composables/property/useResidents'

/**
 * Resident details page.
 * Displays resident information and payment history using extracted components.
 */

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

