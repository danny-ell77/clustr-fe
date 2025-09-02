<template>
    <div class="w-full h-80">
        <div class="flex justify-center mb-4">
            <div class="flex gap-6 text-sm">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Completed</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>In Progress</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-gray-400 rounded"></div>
                    <span>Pending</span>
                </div>
            </div>
        </div>

        <div class="relative ml-12">
            <!-- Y-axis labels -->
            <div class="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 -ml-12">
                <span>{{ maxValue }}</span>
                <span>{{ Math.round(maxValue * 0.75) }}</span>
                <span>{{ Math.round(maxValue * 0.5) }}</span>
                <span>{{ Math.round(maxValue * 0.25) }}</span>
                <span>0</span>
            </div>

            <!-- Chart area -->
            <div class="h-64 flex items-end justify-between px-4 border-b border-l border-gray-200">
                <div v-for="(item, index) in data" :key="index" class="flex flex-col items-center gap-2 flex-1">
                    <!-- Bars -->
                    <div class="relative flex flex-col items-center w-full max-w-12">
                        <div class="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                            :style="{ height: `${(item.completed / maxValue) * 200}px` }"
                            :title="`${item.month}: ${item.completed} completed`"></div>
                        <div class="w-8 bg-yellow-500 transition-all duration-300 hover:opacity-80 cursor-pointer"
                            :style="{ height: `${(item.inProgress / maxValue) * 200}px` }"
                            :title="`${item.month}: ${item.inProgress} in progress`"></div>
                        <div class="w-8 bg-gray-400 rounded-b transition-all duration-300 hover:opacity-80 cursor-pointer"
                            :style="{ height: `${(item.pending / maxValue) * 200}px` }"
                            :title="`${item.month}: ${item.pending} pending`"></div>
                    </div>

                    <!-- Month labels -->
                    <span class="text-xs text-gray-600 mt-2">{{ item.month }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    data: {
        type: Array,
        required: true
    },
    filter: {
        type: String,
        default: 'completed'
    }
})

const maxValue = computed(() => {
    const allValues = props.data.flatMap(item => [item.completed, item.inProgress, item.pending])
    return Math.max(...allValues)
})
</script>