<template>
  <div class="infinite-loader">
    <div v-for="(page, i) in query.data.value?.pages" :key="i">
      <slot :items="page.results" :page-index="i" />
    </div>

    <div v-if="query.isLoading.value && !query.isFetchingNextPage.value" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-3 text-gray-600">Loading...</span>
    </div>

    <div v-if="query.hasNextPage.value" ref="loadMoreTrigger" class="load-more-trigger py-4">
      <div v-if="query.isFetchingNextPage.value" class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span class="ml-2 text-sm text-gray-600">Loading more...</span>
      </div>
      <div v-else-if="!autoLoad" class="text-center">
        <button @click="query.fetchNextPage()"
          class="px-4 py-2 text-primary hover:text-primary-dark text-sm font-medium border border-primary rounded hover:bg-primary/90/5 transition-colors">
          Load more
        </button>
      </div>
    </div>

    <div v-else-if="query.data.value?.pages?.length" class="text-center py-4 text-gray-500 text-sm">
      <slot name="no-more">
        No more items
      </slot>
    </div>

    <div v-if="query.isError.value" class="text-center py-4">
      <p class="text-red-600 text-sm mb-2">
        {{ query.error.value?.message || 'Failed to load data' }}
      </p>
      <button @click="query.refetch()"
        class="px-4 py-2 text-primary hover:text-primary-dark text-sm font-medium border border-primary rounded hover:bg-primary/90/5 transition-colors">
        Try again
      </button>
    </div>

    <div v-if="!query.isLoading.value && !query.data.value?.pages?.[0]?.results?.length" class="text-center py-8">
      <slot name="empty">
        <p class="text-gray-500">No items found</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UseInfiniteQueryReturnType } from '@tanstack/vue-query'

interface Props {
  query: UseInfiniteQueryReturnType<any, any>
  autoLoad?: boolean
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoLoad: true,
  threshold: 0.1
})

const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (props.autoLoad && loadMoreTrigger.value) {
    observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          props.query.hasNextPage.value &&
          !props.query.isFetchingNextPage.value
        ) {
          props.query.fetchNextPage()
        }
      },
      { threshold: props.threshold }
    )

    observer.observe(loadMoreTrigger.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<style scoped>
.load-more-trigger {
  min-height: 60px;
}
</style>
