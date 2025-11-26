<template>
    <div v-if="error" class="query-error">
        <div class="error-content">
            <Icon name="alert-circle" class="error-icon" />
            <div class="error-text">
                <p class="error-message">{{ errorMessage }}</p>
                <button v-if="onRetry" @click="onRetry" class="retry-button">
                    <Icon name="refresh-cw" class="retry-icon" />
                    Try Again
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    error: any
    onRetry?: () => void
    customMessage?: string
}

const props = defineProps<Props>()

const errorMessage = computed(() => {
    if (props.customMessage) return props.customMessage
    return props.error?.data?.message || props.error?.message || 'An error occurred'
})
</script>

<style scoped>
.query-error {
    padding: 1rem;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    margin: 1rem 0;
}

.error-content {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
}

.error-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #dc2626;
    flex-shrink: 0;
    margin-top: 0.125rem;
}

.error-text {
    flex: 1;
}

.error-message {
    color: #991b1b;
    font-size: 0.875rem;
    margin: 0 0 0.5rem 0;
}

.retry-button {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background-color: #dc2626;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.retry-button:hover {
    background-color: #b91c1c;
}

.retry-icon {
    width: 1rem;
    height: 1rem;
}
</style>
