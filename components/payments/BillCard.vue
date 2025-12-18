<template>
  <Card class="hover:shadow-md transition-shadow h-full cursor-pointer relative" @click="$emit('view', bill)">
    <CardContent class="pt-6">
      <div class="space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-semibold text-lg truncate">{{ bill.title }}</h3>
              <StatusBadge :status="billStatus" />
            </div>
            <p v-if="bill.description" class="text-sm text-muted-foreground mt-1 line-clamp-2">
              {{ bill.description }}
            </p>
            <div class="flex items-center gap-2 mt-2 text-sm text-muted-foreground flex-wrap">
              <span class="truncate">{{ bill.billNumber }}</span>
              <span>•</span>
              <span class="truncate">{{ formatBillType(bill.type) }}</span>
              <span v-if="bill.isClusterWide">•</span>
              <span v-if="bill.isClusterWide" class="text-primary whitespace-nowrap">Cluster-wide</span>
            </div>
          </div>
          <div class="flex items-start gap-2 shrink-0">
            <div class="text-right">
              <p class="text-xl font-semibold whitespace-nowrap">{{ formatCurrency(bill.amount) }}</p>
              <p v-if="bill.paidAmount !== '0.00'" class="text-xs text-muted-foreground whitespace-nowrap">
                Paid: {{ formatCurrency(bill.paidAmount) }}
              </p>
            </div>
            <DropdownMenu v-if="showActions && !bill.isFullyPaid && (canEdit || canCancel)">
              <DropdownMenuTrigger as-child @click.stop>
                <Button variant="ghost" size="icon" class="h-8 w-8">
                  <Icon name="more-vertical" class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" @click.stop>
                <DropdownMenuItem v-if="canEdit" @click="$emit('edit', bill)">
                  <Icon name="edit" class="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem v-if="canCancel" class="text-destructive focus:text-destructive" @click="$emit('cancel', bill)">
                  <Icon name="x-circle" class="h-4 w-4 mr-2" />
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p class="text-xs text-muted-foreground">Due Date</p>
            <p class="text-sm font-medium" :class="{ 'text-red-600': bill.isOverdue }">
              {{ formatDate(bill.dueDate) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Status</p>
            <p class="text-sm font-medium">
              {{ bill.isFullyPaid ? 'Fully Paid' : bill.isOverdue ? 'Overdue' : 'Pending' }}
            </p>
          </div>
          <div v-if="bill.acknowledgmentCount > 0">
            <p class="text-xs text-muted-foreground">Acknowledged</p>
            <p class="text-sm font-medium">{{ bill.acknowledgmentCount }} users</p>
          </div>
          <div v-if="bill.isDisputed">
            <p class="text-xs text-muted-foreground">Disputes</p>
            <p class="text-sm font-medium text-yellow-600">{{ bill.disputeCount }}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import type { Bill } from '~/types/payments'

interface Props {
  bill: Bill
  showActions?: boolean
  canEdit?: boolean
  canCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  canEdit: true,
  canCancel: true
})

defineEmits<{
  view: [bill: Bill]
  edit: [bill: Bill]
  cancel: [bill: Bill]
}>()

const billStatus = computed(() => {
  if (props.bill.isFullyPaid) return 'PAID'
  if (props.bill.isOverdue) return 'OVERDUE'
  if (props.bill.isDisputed) return 'DISPUTED'
  return 'PENDING'
})

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(num)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatBillType = (type: string) => {
  return type.split('_').map(word =>
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ')
}
</script>
