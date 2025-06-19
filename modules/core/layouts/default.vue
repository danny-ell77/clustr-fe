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
        <main class="flex-1 p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
// Layout is automatically used by Nuxt
</script>
