<template>
    <div class="flex items-center gap-2">
        <Button size="sm" @click="$emit('previous')">
            <Icon name="chevron-left" class="w-4 h-4" />
        </Button>
        <h3 class="text-lg font-semibold px-4">
            {{ currentMonthYear }}
        </h3>
        <Button size="sm" @click="$emit('next')">
            <Icon name="chevron-right" class="w-4 h-4" />
        </Button>
        <Button size="sm" @click="$emit('today')">
            Today
        </Button>
    </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

defineProps<{
    currentMonthYear: string
}>()

defineEmits<{
    previous: []
    next: []
    today: []
}>()
</script>
