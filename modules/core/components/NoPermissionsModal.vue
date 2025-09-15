<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Glassmorphism backdrop -->
    <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
    
    <!-- Modal content -->
    <div class="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4">
      <!-- Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <Icon name="shield-x" class="w-8 h-8 text-red-600" />
        </div>
      </div>
      
      <!-- Title -->
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-4">
        Access Denied
      </h2>
      
      <!-- Message -->
      <p class="text-gray-600 text-center mb-6 leading-relaxed">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      
      <!-- Actions -->
      <div class="flex flex-col space-y-3">
        <Button 
          @click="goBack" 
          class="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Icon name="arrow-left" class="w-4 h-4 mr-2" />
          Go Back
        </Button>
        
        <Button 
          @click="goHome" 
          variant="outline" 
          class="w-full"
        >
          <Icon name="home" class="w-4 h-4 mr-2" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

const router = useRouter()
const emit = defineEmits(['close'])

const goBack = () => {
  router.back()
  emit('close')
}

const goHome = () => {
  router.push('/')
  emit('close')
}
</script>
