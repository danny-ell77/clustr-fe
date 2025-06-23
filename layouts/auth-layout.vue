<template>
  <div class="min-h-screen flex">
    <!-- Left Section: Branding and Image -->
    <div class="hidden lg:flex lg:w-1/2 bg-cover bg-center items-center justify-center"
         :style="{ backgroundImage: `url('/images/onboarding_bg.jpeg')` }">
      <div class="text-center text-white bg-black bg-opacity-50 p-8 rounded-lg h-full w-full">
        <img src="/images/clustr_logo.png" alt="ClustR Logo" class="mx-auto mb-4 w-24 h-24" />
        <h2 class="text-4xl font-extrabold">ClustR</h2>
        <p class="text-lg mt-2">Property Management & Access Control</p>
      </div>
    </div>

    <!-- Right Section: Forms -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
      <div class="max-w-md w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
// This layout is used for authentication pages
</script>
