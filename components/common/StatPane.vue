<template>
    <Card>
        <CardContent class="p-0">
            <div class="flex">
                <div class="p-4 flex items-center relative">
                    <DynamicSelect v-model="selectedPeriod" :options="periodOptions" placeholder="Select period"
                        trigger-class="w-32" @update:model-value="handlePeriodChange" />
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gray-200" />

                </div>

                <div class="flex flex-1">
                    <div v-for="(stat, index) in stats" :key="index" class="flex-1 p-4 min-w-0 relative">
                        <div class="absolute left-0 top-1/2 -translate-y-1/2 h-full w-px bg-gray-200" />

                        <p class="text-sm font-medium text-muted-foreground mb-1">{{ stat.title }}</p>

                        <div class="flex justify-between flex-wrap">
                            <h3 class="text-2xl font-semibold text-gray-900 mb-2">{{ formatValue(stat.value) }}</h3>

                            <div class="h-8">
                                <apexchart v-if="stat.trendData" type="area" :height="32"
                                    :options="getChartOptions(stat.color)" :series="[{ data: stat.trendData }]"
                                    class="w-[50%]" />
                                <apexchart v-else type="area" :height="32" :options="getChartOptions(stat.color)"
                                    :series="[{ data: generateMockTrend(stat.value) }]" class="w-[50%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '~/components/ui/card'
import DynamicSelect from '~/components/shared/DynamicSelect.vue'
import { generateMockTrend } from '~/utils/mockTrendData'

interface StatPaneItem {
    title: string
    value: string | number | undefined
    trendData?: number[]
    color?: string
}

interface Props {
    stats: StatPaneItem[]
    defaultPeriod?: string
}

interface Emits {
    (e: 'period-change', period: string): void
}

const props = withDefaults(defineProps<Props>(), {
    defaultPeriod: 'This Week'
})

const emit = defineEmits<Emits>()

const periodOptions = [
    'Today',
    'This Week',
    'This Month',
    'This Quarter',
    'This Year',
    'All Time'
]

const selectedPeriod = ref(props.defaultPeriod)

const handlePeriodChange = (period: string | number | null) => {
    if (period) {
        emit('period-change', period.toString())
    }
}

const formatValue = (value: string | number | undefined) => {
    if (value === undefined || value === null) return '-'
    if (typeof value === 'number') {
        return value.toLocaleString()
    }
    return value
}

const getChartOptions = (color?: string) => {
    const chartColor = color || '#0ea5e9'

    return {
        chart: {
            type: 'area',
            sparkline: {
                enabled: true
            },
            toolbar: {
                show: false
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        colors: [chartColor],
        tooltip: {
            enabled: false
        },
        xaxis: {
            labels: {
                show: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        grid: {
            show: false,
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }
    }
}
</script>
