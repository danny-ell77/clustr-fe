<template>
  <div class="min-h-screen bg-gray-50 overflow-hidden">
    <!-- Admin Indicator Outline -->
    <div v-if="isAdmin" class="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50 flex items-center justify-end">
      <span class="bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-bl-md">
        Admin
      </span>
    </div>

    <div class="flex" :class="isAdmin ? 'pt-1' : ''">
      <AppSidebar />

      <div class="flex-1 flex flex-col min-w-0">
        <!-- <EmergencyAlertBanner /> -->
        <AppHeader />

        <main class="flex-1 p-6 max-h-screen overflow-y-auto overflow-hidden">
          <slot />
        </main>
      </div>
    </div>
    <NoPermissionsModal v-if="showPermissionModal" @close="closePermissionModal" />
    <ToastContainer />
  </div>
</template>

<script setup>
import { usePermissionModal } from '~/composables/auth/usePermissionModal'
import { useAuth } from '~/composables/auth/useAuth'
import ToastContainer from '~/components/ToastContainer.vue'
import EmergencyAlertBanner from '~/components/EmergencyAlertBanner.vue'

const { showPermissionModal, closePermissionModal } = usePermissionModal()
const { isAdmin } = useAuth()
</script>
