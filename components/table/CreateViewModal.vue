<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>
                    {{ mode === 'create' ? 'Create New View' : 'Edit View' }}
                </DialogTitle>
                <DialogDescription>
                    {{ mode === 'create' ? 'Create a custom view with your preferred filters' : 'Update your saved view'
                    }}
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-4">
                <div>
                    <Label for="view-name">View Name</Label>
                    <Input id="view-name" v-model="viewName" placeholder="e.g., Urgent Tasks, Overdue Bills"
                        class="mt-1" />
                </div>

                <!-- Collapsible Filters Section -->
                <div class="border-t border-border pt-4">
                    <button type="button"
                        class="flex items-center justify-between w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        @click="showFilters = !showFilters">
                        <span>Filters</span>
                        <Icon :name="showFilters ? 'chevron-up' : 'chevron-down'" class="w-4 h-4" />
                    </button>
                    <p class="text-xs text-muted-foreground mt-1">
                        {{ showFilters ? 'Customize filters for this view' : 'Using current filters' }}
                    </p>

                    <div v-if="showFilters" class="mt-4 space-y-3">
                        <slot name="filters" :filters="localFilters" :set-filter="setLocalFilter" />
                    </div>
                </div>

                <div class="flex items-center space-x-2 pb-3">
                    <Checkbox id="persist-view" v-model:checked="persistView" />
                    <Label for="persist-view" class="text-sm font-normal cursor-pointer">
                        Show this view as a tab
                    </Label>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" @click="cancel">
                    Cancel
                </Button>
                <Button @click="saveAndApply">
                    {{ mode === 'create' ? 'Create & Apply' : 'Update & Apply' }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Checkbox } from '~/components/ui/checkbox'
import Icon from '~/components/Icon.vue'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '~/components/ui/dialog'
import type { SavedView, FilterState } from '~/types/saved-views'

interface Props {
    open: boolean
    mode?: 'create' | 'edit'
    view?: SavedView | null
    currentFilters?: FilterState
}

interface Emits {
    (e: 'update:open', value: boolean): void
    (e: 'save', data: { name: string; filters: FilterState; persisted: boolean }): void
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'create',
    view: null,
    currentFilters: () => ({})
})

const emit = defineEmits<Emits>()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const viewName = ref('')
const localFilters = ref<FilterState>({})
const persistView = ref(true)
const showFilters = ref(false)

watch(() => props.open, (open) => {
    if (open) {
        if (props.mode === 'edit' && props.view) {
            viewName.value = props.view.name
            localFilters.value = { ...props.view.filters }
            persistView.value = props.view.persisted
            showFilters.value = true
        } else {
            viewName.value = ''
            localFilters.value = { ...props.currentFilters }
            persistView.value = true
            showFilters.value = false
        }
    }
})

const setLocalFilter = (field: string, value: any) => {
    if (value === null || value === undefined || value === '' || value === 'All') {
        delete localFilters.value[field]
    } else {
        localFilters.value[field] = value
    }
}

const saveAndApply = () => {
    if (!viewName.value.trim()) {
        return
    }

    const filtersToSave = showFilters.value ? { ...localFilters.value } : { ...props.currentFilters }

    emit('save', {
        name: viewName.value.trim(),
        filters: filtersToSave,
        persisted: persistView.value
    })

    isOpen.value = false
}

const cancel = () => {
    isOpen.value = false
}
</script>
