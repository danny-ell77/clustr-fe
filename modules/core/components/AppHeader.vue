<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h2>
          <p v-if="pageDescription" class="text-sm text-gray-600 mt-1">
            {{ pageDescription }}
          </p>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Icon name="bell" class="w-5 h-5" />
          </button>
          
          <!-- User Menu -->
          <div class="relative">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-white">
                  {{ user?.name.charAt(0) }}
                </span>
              </div>
              <Icon name="chevron-down" class="w-4 h-4 text-gray-400" />
            </button>
            
            <!-- Dropdown Menu -->
            <div 
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile Settings
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Preferences
              </a>
              <hr class="my-1">
              <button 
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../runtime/composables/useAuth'
import { useRoute, navigateTo } from '#app'

const { user, logout } = useAuth()
const route = useRoute()
const showUserMenu = ref(false)

const pageTitle = computed(() => {
  return route.meta?.title || 'Dashboard'
})

const pageDescription = computed(() => {
  return route.meta?.description || ''
})

async function handleLogout() {
  await logout()
  showUserMenu.value = false
  await navigateTo('/login')
}

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>
