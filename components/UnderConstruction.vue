<template>
  <div class="bg-white rounded-lg shadow-lg p-8 text-center">
    <!-- Construction Icon -->
    <div class="w-24 h-24 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
      <Icon name="construction" class="w-12 h-12 text-yellow-600" />
    </div>
    
    <!-- Title -->
    <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ title }}</h2>
    
    <!-- Description -->
    <p class="text-gray-600 mb-8 max-w-2xl mx-auto">{{ description }}</p>
    
    <!-- Features List -->
    <div v-if="features && features.length" class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Coming Soon:</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
        <div 
          v-for="feature in features" 
          :key="feature"
          class="flex items-center text-left p-3 bg-gray-50 rounded-lg"
        >
          <Icon name="check-circle" class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
          <span class="text-gray-700">{{ feature }}</span>
        </div>
      </div>
    </div>
    
    <!-- Progress Indicator -->
    <div class="mb-6">
      <div class="flex items-center justify-center space-x-2 mb-2">
        <Icon name="clock" class="w-4 h-4 text-blue-600" />
        <span class="text-sm font-medium text-blue-600">Development in Progress</span>
      </div>
      <div class="w-64 mx-auto bg-gray-200 rounded-full h-2">
        <div class="bg-blue-600 h-2 rounded-full" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="text-xs text-gray-500 mt-1">{{ progress }}% Complete</p>
    </div>
    
    <!-- Contact Info -->
    <div class="text-sm text-gray-500">
      <p>Need immediate assistance? Contact our support team.</p>
      <button class="mt-2 text-blue-600 hover:text-blue-800 font-medium">
        Get Support
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Under Construction'
  },
  description: {
    type: String,
    default: 'This feature is currently being developed and will be available soon.'
  },
  features: {
    type: Array,
    default: () => []
  },
  progress: {
    type: Number,
    default: 65
  }
})
</script>
