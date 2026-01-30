<template>
  <Card class="hover:shadow-md transition-shadow h-full cursor-pointer relative" @click="$emit('view', resident)">
    <CardContent class="pt-6">
      <div class="space-y-4">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-3">
            <div v-if="resident.profileImageUrl" class="w-12 h-12 rounded-full overflow-hidden shrink-0">
              <img :src="resident.profileImageUrl" :alt="resident.name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-sm font-medium text-primary">{{ getInitials(resident.name) }}</span>
            </div>
            <div class="min-w-0 max-w-[180px]">
              <h3 class="font-semibold text-lg truncate">{{ resident.name }}</h3>
              <p class="text-sm text-muted-foreground truncate">{{ resident.emailAddress }}</p>
            </div>
          </div>

          <DropdownMenu v-if="showActions">
            <DropdownMenuTrigger as-child @click.stop>
              <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0">
                <Icon name="more-vertical" class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" @click.stop>
              <DropdownMenuItem v-if="!resident.approvedByAdmin && canApprove" @click="$emit('approve', resident)">
                <Icon name="check-circle" class="h-4 w-4 mr-2" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem v-if="canEdit" @click="$emit('edit', resident)">
                <Icon name="edit" class="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <Badge :variant="resident.approvedByAdmin ? 'default' : 'secondary'">
            {{ resident.approvedByAdmin ? 'Approved' : 'Pending' }}
          </Badge>
          <Badge :variant="resident.apartmentStatus === 'OCCUPIED' ? 'default' : 'outline'">
            {{ resident.apartmentStatus }}
          </Badge>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p class="text-xs text-muted-foreground">Phone</p>
            <p class="text-sm font-medium truncate">{{ resident.phoneNumber || '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Unit</p>
            <p class="text-sm font-medium truncate">{{ resident.unitAddress || '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Bills</p>
            <BillsSummaryBadge :paid-count="resident.billsSummary?.paid || 0"
              :total-count="resident.billsSummary?.total || 0" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import Icon from '~/components/Icon.vue'
import BillsSummaryBadge from '~/components/property/residents/BillsSummaryBadge.vue'

interface Resident {
  id: string
  name: string
  emailAddress?: string
  phoneNumber?: string
  profileImageUrl?: string
  unitAddress?: string
  approvedByAdmin: boolean
  apartmentStatus?: string
  billsSummary?: {
    paid: number
    total: number
  }
}

interface Props {
  resident: Resident
  showActions?: boolean
  canEdit?: boolean
  canApprove?: boolean
}

withDefaults(defineProps<Props>(), {
  showActions: true,
  canEdit: true,
  canApprove: true
})

defineEmits<{
  view: [resident: Resident]
  edit: [resident: Resident]
  approve: [resident: Resident]
}>()

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>
