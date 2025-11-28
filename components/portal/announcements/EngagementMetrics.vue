<template>
    <Card>
        <CardHeader>
            <CardTitle class="text-lg">Engagement Metrics</CardTitle>
            <CardDescription>
                Track how residents are interacting with this announcement
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div v-if="loading" class="space-y-4">
                <Skeleton class="h-20 w-full" />
                <Skeleton class="h-20 w-full" />
                <Skeleton class="h-20 w-full" />
            </div>

            <div v-else-if="metrics" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-4 bg-primary/10 rounded-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-primary">Views</p>
                                <p class="text-2xl text-primary mt-1">
                                    {{ metrics.viewsCount || 0 }}
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
                                <Icon name="eye" class="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div class="p-4 bg-red-50 rounded-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-red-900">Likes</p>
                                <p class="text-2xl text-red-600 mt-1">
                                    {{ metrics.likesCount || 0 }}
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <Icon name="heart" class="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div class="p-4 bg-green-50 rounded-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-green-900">Comments</p>
                                <p class="text-2xl text-green-600 mt-1">
                                    {{ metrics.commentsCount || 0 }}
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Icon name="message-circle" class="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 border rounded-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                            <p class="text-xl mt-1">
                                {{ engagementRate }}%
                            </p>
                            <p class="text-xs text-muted-foreground mt-1">
                                Based on views, likes, and comments
                            </p>
                        </div>
                        <div class="w-16 h-16 relative">
                            <svg class="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="none"
                                    class="text-gray-200" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="none"
                                    :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
                                    :class="engagementColorClass" class="transition-all duration-500" />
                            </svg>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-xs">{{ engagementRate }}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="showDetails" class="space-y-3">
                    <Separator />
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-muted-foreground">Published</p>
                            <p class="font-medium">{{ formattedPublishDate }}</p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">Last Updated</p>
                            <p class="font-medium">{{ formattedUpdateDate }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-8 text-muted-foreground">
                <Icon name="bar-chart" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No engagement data available</p>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import type { AnnouncementEngagementMetrics } from '~/types/announcements'

interface Props {
    metrics?: AnnouncementEngagementMetrics
    loading?: boolean
    showDetails?: boolean
    publishedAt?: string
    updatedAt?: string
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    showDetails: true
})

const engagementRate = computed(() => {
    if (!props.metrics) return 0
    const rate = props.metrics.engagementRate || 0
    return Math.round(rate * 100) / 100
})

const circumference = 2 * Math.PI * 28

const dashOffset = computed(() => {
    const rate = engagementRate.value
    return circumference - (rate / 100) * circumference
})

const engagementColorClass = computed(() => {
    const rate = engagementRate.value
    if (rate >= 75) return 'text-green-600'
    if (rate >= 50) return 'text-primary'
    if (rate >= 25) return 'text-yellow-600'
    return 'text-red-600'
})

const formattedPublishDate = computed(() => {
    if (!props.publishedAt) return 'N/A'
    const date = new Date(props.publishedAt)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
})

const formattedUpdateDate = computed(() => {
    if (!props.updatedAt) return 'N/A'
    const date = new Date(props.updatedAt)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
})
</script>
