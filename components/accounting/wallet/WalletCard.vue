<template>
  <Card class="wallet-card">
    <CardContent class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-medium">Wallet balance</h2>
        <Button 
          variant="link"
          size="sm"
          class="text-primary hover:text-primary/90 p-0 h-auto"
          @click="$emit('fund')">
          + Fund wallet
        </Button>
      </div>
      
      <div class="flex items-center space-x-2 mb-6">
        <span class="text-3xl">{{ formattedBalance }}</span>
        <Button 
          v-if="showRefresh" 
          variant="ghost" 
          size="icon"
          class="h-8 w-8"
          @click="$emit('refresh')">
          <Icon name="refresh" class="w-5 h-5" />
        </Button>
      </div>
      
      <div class="flex space-x-4">
        <Button 
          class="flex-1"
          @click="$emit('billPayment')">
          Bill payment
        </Button>
        <Button
          variant="outline"
          class="flex-1" 
          @click="$emit('schedulePayment')">
          Schedule payment
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import Icon from '~/components/Icon.vue'
import { formatWalletBalance } from '~/utils/wallet-formatters'

interface Props {
  balance: number
  showRefresh?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRefresh: true
})

const emit = defineEmits<{
  (e: 'fund'): void
  (e: 'refresh'): void
  (e: 'billPayment'): void
  (e: 'schedulePayment'): void
}>()

const formattedBalance = computed(() => {
  return formatWalletBalance(props.balance)
})
</script>

<style scoped>
.wallet-card {
  background: linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%);
  border: 1px solid hsl(var(--border));
}
</style>