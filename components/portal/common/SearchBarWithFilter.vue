<template>
    <div class="relative">
        <Icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input type="text" :placeholder="placeholder" class="pl-10 pr-10"
            @input="(e: Event) => $emit('search', (e.target as HTMLInputElement).value)" />
        <button @click="$emit('toggle-filters')"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="sliders" class="w-4 h-4 scale-x-[-1]" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { Input } from '~/components/ui/input'
import Icon from '~/components/Icon.vue'

interface Props {
    placeholder?: string
}

withDefaults(defineProps<Props>(), {
    placeholder: 'Search...'
})

defineEmits<{
    search: [value: string]
    'toggle-filters': []
}>()
</script>
