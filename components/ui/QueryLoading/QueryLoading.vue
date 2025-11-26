<template>
    <div class="query-loading">
        <div class="spinner"></div>
        <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
interface Props {
    message?: string
}

defineProps<Props>()
</script>

<style scoped>
.query-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
}

.spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-message {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
}
</style>
