<template>
  <div class="space-y-6">
    <!-- Notifications -->
    <NotificationsSidebar
      :notifications="notifications"
      @see-all="$emit('seeAllNotifications')"
      @notification-click="$emit('notificationClick', $event)"
    />

    <!-- Scheduled Payments -->
    <Card>
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <CardTitle class="text-sm">Scheduled Payment</CardTitle>
          <Button variant="ghost" size="sm" class="text-xs text-blue-600" @click="$emit('seeAllScheduled')">
            See all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <!-- <ScheduledPayments
          :payments="scheduledPayments"
          @edit="$emit('editScheduledPayment', $event)"
          @cancel="$emit('cancelScheduledPayment', $event)"
        /> -->
      </CardContent>
    </Card>

    <!-- Pending Payments -->
    <PendingPayments
      :pending-payments="pendingPayments"
      @see-all="$emit('seeAllPending')"
      @payment-click="$emit('pendingPaymentClick', $event)"
    />
  </div>
</template>

<script setup>
import NotificationsSidebar from './NotificationsSidebar.vue'
import ScheduledPayments from './ScheduledPayments.vue'
import PendingPayments from './PendingPayments.vue'
import { Button } from '~/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '~/components/ui/card'

defineProps({
  notifications: {
    type: Array,
    required: true
  },
  scheduledPayments: {
    type: Array,
    required: true
  },
  pendingPayments: {
    type: Array,
    required: true
  }
})

defineEmits([
  'seeAllNotifications',
  'notificationClick',
  'seeAllScheduled',
  'editScheduledPayment',
  'cancelScheduledPayment',
  'seeAllPending',
  'pendingPaymentClick'
])
</script>