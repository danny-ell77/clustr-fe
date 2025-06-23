<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex">
      <!-- Sidebar -->
      <AppSidebar />
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <AppHeader />
        
        <!-- Page Content -->
        <main class="flex-1 p-6 max-h-screen overflow-y-auto">
          <slot />
        </main>
      </div>
    </div>
    <NoPermissionsModal v-if="showPermissionModal" @close="closePermissionModal" />
  </div>
</template>

<script setup>
import { usePermissionModal } from '~/modules/core/runtime/composables/usePermissionModal'
const { showPermissionModal, closePermissionModal } = usePermissionModal()
</script>
