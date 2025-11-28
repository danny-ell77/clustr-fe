<template>
  <Card>
    <CardContent class="pt-6">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
          <div class="flex items-baseline gap-2 mt-2">
            <h3 class="text-2xl">{{ formattedValue }}</h3>
            <span v-if="suffix" class="text-sm text-muted-foreground">{{ suffix }}</span>
          </div>
          <div v-if="trend !== undefined" class="flex items-center gap-1 mt-2">
            <Icon 
              :name="trend >= 0 ? 'trending-up' : 'trending-down'" 
              :class="[
                'w-4 h-4',
                trend >= 0 ? 'text-green-600' : 'text-red-600'
              ]"
            />
            <span 
              :class="[
                'text-sm font-medium',
                trend >= 0 ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ Math.abs(trend) }}%
            </span>
            <span class="text-sm text-muted-foreground">vs last period</span>
          </div>
        </div>
        <div 
          v-if="icon"
          :class="[
            'flex items-center justify-center w-12 h-12 rounded-lg',
            iconBackgroundClass
          ]"
        >
          <Icon :name="icon" :class="['w-6 h-6', iconColorClass]" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import Icon from '~/components/Icon.vue'

interface Props {
  title: string
  value: string | number | undefined
  suffix?: string
  icon?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  trend?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const formattedValue = computed(() => {
  if (props.value === undefined || props.value === null) return '-'
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const iconBackgroundClass = computed(() => {
  const colors = {
    blue: 'bg-primary/15',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100',
    gray: 'bg-gray-100'
  }
  return colors[props.color]
})

const iconColorClass = computed(() => {
  const colors = {
    blue: 'text-primary',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  }
  return colors[props.color]
})
</script>
