<template>
  <Card>
    <CardHeader>
      <CardTitle>Bills Overview</CardTitle>
      <CardDescription>Payment status breakdown</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex items-center justify-center">
        <div class="relative w-48 h-48">
          <svg viewBox="0 0 100 100" class="transform -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              stroke-width="10"
              class="text-muted"
              opacity="0.2"
            />
            <circle
              v-if="paidPercentage > 0"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              stroke-width="10"
              class="text-green-500"
              :stroke-dasharray="`${paidPercentage * 2.51} 251`"
              stroke-linecap="round"
            />
            <circle
              v-if="unpaidPercentage > 0"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              stroke-width="10"
              class="text-red-500"
              :stroke-dasharray="`${unpaidPercentage * 2.51} 251`"
              :stroke-dashoffset="`${-paidPercentage * 2.51}`"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <p class="text-2xl font-semibold">{{ totalBills }}</p>
              <p class="text-xs text-muted-foreground">Total Bills</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500" />
            <span class="text-sm">Paid</span>
          </div>
          <span class="text-sm font-medium">{{ paidCount }} ({{ paidPercentage.toFixed(0) }}%)</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500" />
            <span class="text-sm">Unpaid</span>
          </div>
          <span class="text-sm font-medium">{{ unpaidCount }} ({{ unpaidPercentage.toFixed(0) }}%)</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  paidCount: number
  unpaidCount: number
}

const props = defineProps<Props>()

const totalBills = computed(() => props.paidCount + props.unpaidCount)
const paidPercentage = computed(() => totalBills.value > 0 ? (props.paidCount / totalBills.value) * 100 : 0)
const unpaidPercentage = computed(() => totalBills.value > 0 ? (props.unpaidCount / totalBills.value) * 100 : 0)
</script>
