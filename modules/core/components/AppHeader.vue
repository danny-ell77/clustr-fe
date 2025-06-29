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
          <Button variant="ghost" size="icon" class="text-gray-400 hover:text-gray-600">
            <Icon name="bell" class="w-5 h-5" />
          </Button>
          
          <!-- User Menu -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar class="w-8 h-8">
                  <AvatarFallback class="bg-blue-600 text-white text-sm font-medium">
                    {{ user?.name.charAt(0) }}
                  </AvatarFallback>
                </Avatar>
                <Icon name="chevron-down" class="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-48" align="end">
              <DropdownMenuItem>
                <!-- <Icon name="user" class="w-4 h-4 mr-2" /> -->
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <!-- <Icon name="settings" class="w-4 h-4 mr-2" /> -->
                Preferences
              </DropdownMenuItem>
              <Separator class="my-1" />
              <DropdownMenuItem @click="handleLogout">
                <!-- <Icon name="log-out" class="w-4 h-4 mr-2" /> -->
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '../runtime/composables/useAuth'
import { usePageMeta } from '../runtime/composables/usePageMeta' // Import the new composable
import { useRoute, navigateTo, useRuntimeConfig } from '#app' // Import useRuntimeConfig
import Icon from '~/components/Icon.vue'


const route = useRoute()
const config = useRuntimeConfig() // Get runtime config
const { user, logout } = useAuth()
const { pageTitle, pageDescription } = usePageMeta() // Use the new composable

async function handleLogout() {
  await logout()
  await navigateTo('/login')
}
</script>
