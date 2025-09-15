<template>
  <div>
    <!-- Content slot -->
    <slot :items="items" :loading="loading" :error="error" :refresh="refresh" />
    
    <!-- Load more trigger (for infinite scroll) -->
    <div 
      v-if="hasNextPage" 
      ref="loadMoreTrigger" 
      class="load-more-trigger py-4"
    >
      <div v-if="loading" class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span class="ml-2 text-sm text-gray-600">Loading more...</span>
      </div>
      <div v-else class="text-center">
        <button 
          @click="loadMore" 
          class="text-primary hover:text-primary-dark text-sm font-medium"
        >
          Load more
        </button>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-if="error" class="text-center py-4">
      <p class="text-red-600 text-sm mb-2">{{ error }}</p>
      <button 
        @click="refresh" 
        class="text-primary hover:text-primary-dark text-sm font-medium"
      >
        Try again
      </button>
    </div>
    
    <!-- Empty state -->
    <div v-if="isEmpty" class="text-center py-8">
      <slot name="empty">
        <p class="text-gray-500">No items found</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fetchFn: Function
  pageSize?: number
  autoLoad?: boolean
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 20,
  autoLoad: true,
  threshold: 0.1
})

const { 
  items, 
  loading, 
  error, 
  hasNextPage, 
  isEmpty,
  loadMore, 
  refresh 
} = usePagination(props.fetchFn, { 
  pageSize: props.pageSize,
  infiniteScroll: true
})

const loadMoreTrigger = ref<HTMLElement | null>(null)

onMounted(() => {
  if (props.autoLoad && loadMoreTrigger.value) {
    // Set up intersection observer for auto-loading
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage.value && !loading.value) {
          loadMore()
        }
      }, 
      { threshold: props.threshold }
    )
    
    observer.observe(loadMoreTrigger.value)
    
    onUnmounted(() => {
      observer.disconnect()
    })
  }
})
</script>

<style scoped>
.load-more-trigger {
  min-height: 60px;
}
</style>