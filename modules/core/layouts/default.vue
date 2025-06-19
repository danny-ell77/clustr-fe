<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <AppHeader />
      
      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
// Layout is automatically used by Nuxt
</script>
