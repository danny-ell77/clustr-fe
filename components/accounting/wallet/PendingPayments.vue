<template>
  <Card>
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-sm">Pending Payment</CardTitle>
        <Button variant="ghost" size="sm" class="text-xs text-primary" @click="$emit('seeAll')">
          See all
        </Button>
      </div>
    </CardHeader>
    <CardContent class="space-y-3">
      <div 
        v-for="payment in pendingPayments" 
        :key="payment.id" 
        class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        @click="$emit('paymentClick', payment)"
      >
        <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon :name="payment.icon" class="w-4 h-4 text-red-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">{{ payment.description }}</p>
          <p class="text-xs text-red-500">Due: {{ payment.dueDate }}</p>
        </div>
      </div>
      
      <div v-if="pendingPayments.length === 0" class="text-center py-4 text-gray-500 text-sm">
        No pending payments
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import Icon from '~/components/Icon.vue'
import { Button } from '~/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '~/components/ui/card'

defineProps({
  pendingPayments: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['seeAll', 'paymentClick'])
</script>