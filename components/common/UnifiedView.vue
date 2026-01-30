<template>
    <div class="bg-card rounded-lg shadow-sm border overflow-hidden">
        <ViewsTabBar :persisted-views="persistedViews" :active-view-id="activeViewId" :current-filters="filters"
            :show-view-switcher="availableViews.length > 1" :current-view-mode="currentViewMode"
            @activate="activateView" @create="showViewModal = true" @edit="editViewHandler" @delete="deleteView"
            @clear-filters="resetFilters" @switch-view="handleViewModeSwitch">
            <template #filters>
                <slot name="filters" :filters="filters" :apply-filters="applyFilters" />
            </template>
        </ViewsTabBar>

        <div class="p-4 max-w-full overflow-auto">
            <div v-if="currentViewMode === 'grid' && availableViews.includes('grid')">
                <slot name="grid" :data="data" :is-loading="isLoading" />
            </div>

            <div v-else-if="currentViewMode === 'table' && availableViews.includes('table')">
                <slot name="table" :data="data" :is-loading="isLoading" />
            </div>
        </div>

        <CreateViewModal v-model:open="showViewModal" :mode="viewModalMode" :view="editingView"
            :current-filters="filters" @save="handleSaveView">
            <template #filters="{ filters: modalFilters, setFilter }">
                <slot name="modal-filters" :filters="modalFilters" :set-filter="setFilter" />
            </template>
        </CreateViewModal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ViewsTabBar from '~/components/table/ViewsTabBar.vue'
import CreateViewModal from '~/components/table/CreateViewModal.vue'
import { useSavedViews } from '~/composables/useSavedViews'
import type { SavedView } from '~/types/saved-views'

interface Props {
    pageKey: string
    data: any[]
    isLoading?: boolean
    availableViews?: ('grid' | 'table')[]
    defaultViewMode?: 'grid' | 'table'
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    availableViews: () => ['table'],
    defaultViewMode: 'table'
})

const {
    filters,
    activeViewId,
    persistedViews,
    applyFilters,
    createView,
    updateView,
    deleteView,
    activateView,
    resetFilters
} = useSavedViews(props.pageKey)

const showViewModal = ref(false)
const viewModalMode = ref<'create' | 'edit'>('create')
const editingView = ref<SavedView | null>(null)
const currentViewMode = ref<'grid' | 'table'>(props.defaultViewMode)

const STORAGE_KEY = `view-mode-${props.pageKey}`

const loadViewMode = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored && props.availableViews.includes(stored as 'grid' | 'table')) {
            currentViewMode.value = stored as 'grid' | 'table'
        }
    } catch (error) {
        console.error('Failed to load view mode:', error)
    }
}

const saveViewMode = (mode: 'grid' | 'table') => {
    try {
        localStorage.setItem(STORAGE_KEY, mode)
    } catch (error) {
        console.error('Failed to save view mode:', error)
    }
}

loadViewMode()

const editViewHandler = (view: SavedView) => {
    editingView.value = view
    viewModalMode.value = 'edit'
    showViewModal.value = true
}

const handleSaveView = (data: { name: string; filters: any; persisted: boolean }) => {
    if (viewModalMode.value === 'edit' && editingView.value) {
        updateView(editingView.value.id, { ...data, viewMode: currentViewMode.value })
    } else {
        const newView = createView({ ...data, viewMode: currentViewMode.value })
        activateView(newView.id)
    }
    showViewModal.value = false
    editingView.value = null
}

const handleViewModeSwitch = (mode: 'grid' | 'table') => {
    currentViewMode.value = mode
    saveViewMode(mode)
}
</script>
