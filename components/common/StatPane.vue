<template>
    <Card>
        <CardContent class="p-0">
            <div class="flex divide-x divide-gray-200">
                <div v-for="(stat, index) in stats" :key="index" class="flex-1 p-4 min-w-0">
                    <p class="text-sm font-medium text-muted-foreground mb-1">{{ stat.title }}</p>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ formatValue(stat.value) }}</h3>

                    <div class="h-8">
                        <apexchart v-if="stat.trendData" type="area" :height="32" :options="getChartOptions(stat.color)"
                            :series="[{ data: stat.trendData }]" />
                        <apexchart v-else type="area" :height="32" :options="getChartOptions(stat.color)"
                            :series="[{ data: generateMockTrend(stat.value) }]" />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { generateMockTrend } from '~/utils/mockTrendData'

interface StatPaneItem {
    title: string
    value: string | number | undefined
    trendData?: number[]
    color?: string
}

interface Props {
    stats: StatPaneItem[]
}

const props = defineProps<Props>()

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
