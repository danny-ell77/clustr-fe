<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button variant="ghost" @click="$router.back()">
                    <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 class="text-3xl font-semibold">{{ shift?.title }}</h1>
                    <p class="text-muted-foreground">Shift Details</p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <Button v-if="shift?.status === 'SCHEDULED'" @click="showClockInDialog = true" variant="outline">
                    <Icon name="lucide:clock" class="w-4 h-4 mr-2" />
                    Clock In
                </Button>

                <Button v-if="shift?.status === 'IN_PROGRESS'" @click="showClockOutDialog = true" variant="outline">
                    <Icon name="lucide:clock" class="w-4 h-4 mr-2" />
                    Clock Out
                </Button>

                <Button v-if="shift?.status === 'SCHEDULED'" @click="handleCancel" variant="destructive"
                    :disabled="cancelShiftMutation.isPending.value">
                    <Icon name="lucide:x-circle" class="w-4 h-4 mr-2" />
                    {{ cancelShiftMutation.isPending.value ? 'Cancelling...' : 'Cancel Shift' }}
                </Button>
            </div>
        </div>

        <div v-if="shiftQuery.isLoading.value" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="shiftQuery.isError.value" class="text-center py-12">
            <p class="text-destructive">Failed to load shift details</p>
            <Button @click="() => shiftQuery.refetch()" class="mt-4">Retry</Button>
        </div>

        <ShiftDetailContent v-else-if="shift" :shift="shift" />

        <ClockInOutDialog v-model:open="showClockInDialog" :shift="shift" action="in" @submit="handleClockIn" />
        <ClockInOutDialog v-model:open="showClockOutDialog" :shift="shift" action="out" @submit="handleClockOut" />
    </div>

</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'
import ShiftDetailContent from '~/components/shift/ShiftDetailContent.vue'
import ClockInOutDialog from '~/components/shift/ClockInOutDialog.vue'
import { Button } from '~/components/ui/button'
import { useShifts } from '~/composables/shift/useShifts'
import type { ClockInOutDto } from '~/types/shifts'

/**
 * Shift Detail page.
 * Displays shift information using extracted components.
 */

const route = useRoute()
const router = useRouter()

definePageMeta({
    requiresPermission: 'shift.overview.view'
})

const shiftId = computed(() => route.params.id as string)
const showClockInDialog = ref(false)
const showClockOutDialog = ref(false)

const { useShift, clockInMutation, clockOutMutation, cancelShiftMutation } = useShifts()

const shiftQuery = useShift(shiftId)
const shift = computed(() => shiftQuery.data.value)

const handleClockIn = async (data: ClockInOutDto) => {
    await clockInMutation.mutateAsync({ id: shiftId.value, data })
    showClockInDialog.value = false
}

const handleClockOut = async (data: ClockInOutDto) => {
    await clockOutMutation.mutateAsync({ id: shiftId.value, data })
    showClockOutDialog.value = false
}

const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this shift?')) {
        await cancelShiftMutation.mutateAsync(shiftId.value)
        router.push('/shift')
    }
}
</script>

