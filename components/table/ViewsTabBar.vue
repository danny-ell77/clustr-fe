<template>
    <div class="relative">
        <!-- Tab bar with border-bottom -->
        <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 px-4">
            
            <!-- Tabs container - positioned relative so active tab can extend past border -->
            <div class="flex items-center gap-1 relative">
                <button v-for="view in persistedViews" :key="view.id" 
                    :class="[
                        'group px-4 py-2 text-sm font-medium transition-all duration-200',
                        'flex items-center gap-2 min-w-[120px] max-w-[200px] rounded-t-md -mb-[10px]',
                        activeViewId === view.id
                            ? 'bg-white border-t border-l border-r border-gray-200 text-foreground relative z-10'
                            : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-gray-100'
                    ]" 
                    :aria-selected="activeViewId === view.id" 
                    role="tab"
                    @click="activateView(view.id)" 
                    @contextmenu.prevent="openContextMenu(view, $event)"
                >
                    <span class="truncate flex-1 text-left">{{ view.name }}</span>
                    
                    <button v-if="persistedViews.length > 1"
                        class="opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded p-0.5 transition-opacity"
                        @click.stop="confirmDelete(view)">
                        <Icon name="x" class="w-1 h-1" />
                    </button>
                </button>

                <button
                    class="ml-1 p-1.5 text-muted-foreground hover:text-foreground hover:bg-gray-200 rounded-md transition-colors"
                    aria-label="Create new view" @click="$emit('create')">
                    <Icon name="plus" class="w-4 h-4" />
                </button>
            </div>

            <!-- Right side actions -->
            <div class="flex items-center gap-2 py-2">
                <div v-if="showViewSwitcher" class="flex items-center border border-gray-200 rounded-md bg-white p-0.5">
                    <Button variant="ghost" size="sm" :class="[
                        'h-7 px-2 rounded-sm',
                        currentViewMode === 'grid' ? 'bg-gray-100' : 'bg-transparent'
                    ]" @click="$emit('switchView', 'grid')">
                        <Icon name="grid" class="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" :class="[
                        'h-7 px-2 rounded-sm',
                        currentViewMode === 'table' ? 'bg-gray-100' : 'bg-transparent'
                    ]" @click="$emit('switchView', 'table')">
                        <Icon name="table" class="w-4 h-4" />
                    </Button>
                </div>

                <Popover v-model:open="showFiltersPopover">
                    <PopoverTrigger as-child>
                        <Button variant="outline" size="sm" class="gap-2 h-8 border-gray-200 shadow-sm">
                            <Icon name="filter" class="w-4 h-4" />
                            <span class="font-medium">Filter</span>
                            <span v-if="activeFilterCount > 0"
                                class="ml-1 flex items-center justify-center w-4 h-4 text-[10px] bg-primary text-primary-foreground rounded-full">
                                {{ activeFilterCount }}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-96" align="end">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h4 class="font-medium">Filters</h4>
                                <Button v-if="activeFilterCount > 0" variant="ghost" size="sm"
                                    @click="handleClearFilters">
                                    Clear All
                                </Button>
                            </div>
                            <slot name="filters" />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>

        <!-- Context menu for right-click on tabs -->
        <DropdownMenu v-if="contextMenuView" v-model:open="showContextMenu">
            <DropdownMenuTrigger as-child>
                <div :style="{ position: 'fixed', left: `${contextMenuX}px`, top: `${contextMenuY}px` }" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem @click="editView">
                    <Icon name="edit" class="w-4 h-4 mr-2" />
                    Edit View
                </DropdownMenuItem>
                <DropdownMenuItem class="text-destructive" @click="deleteView">
                    <Icon name="trash" class="w-4 h-4 mr-2" />
                    Delete View
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '~/components/Icon.vue'
import { Button } from '~/components/ui/button'
import Popover from '~/components/ui/popover/Popover.vue'
import PopoverContent from '~/components/ui/popover/PopoverContent.vue'
import PopoverTrigger from '~/components/ui/popover/PopoverTrigger.vue'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import type { SavedView, FilterState } from '~/types/saved-views'

interface Props {
    persistedViews: SavedView[]
    activeViewId: string | null
    currentFilters?: FilterState
    showViewSwitcher?: boolean
    currentViewMode?: 'grid' | 'table'
}

interface Emits {
    (e: 'activate', id: string): void
    (e: 'create'): void
    (e: 'edit', view: SavedView): void
    (e: 'delete', id: string): void
    (e: 'clearFilters'): void
    (e: 'switchView', mode: 'grid' | 'table'): void
}

const props = withDefaults(defineProps<Props>(), {
    currentFilters: () => ({}),
    showViewSwitcher: false,
    currentViewMode: 'table'
})
const emit = defineEmits<Emits>()

const showContextMenu = ref(false)
const showFiltersPopover = ref(false)
const contextMenuView = ref<SavedView | null>(null)
const contextMenuX = ref(0)
const contextMenuY = ref(0)

const activeFilterCount = computed(() => {
    return Object.keys(props.currentFilters).filter(key =>
        props.currentFilters[key] !== null &&
        props.currentFilters[key] !== undefined &&
        props.currentFilters[key] !== '' &&
        props.currentFilters[key] !== 'All'
    ).length
})

const activateView = (id: string) => {
    emit('activate', id)
}

const openContextMenu = (view: SavedView, event: MouseEvent) => {
    contextMenuView.value = view
    contextMenuX.value = event.clientX
    contextMenuY.value = event.clientY
    showContextMenu.value = true
}

const editView = () => {
    if (contextMenuView.value) {
        emit('edit', contextMenuView.value)
    }
    showContextMenu.value = false
}

const confirmDelete = (view: SavedView) => {
    if (confirm(`Delete view "${view.name}"?`)) {
        emit('delete', view.id)
    }
}

const deleteView = () => {
    if (contextMenuView.value) {
        emit('delete', contextMenuView.value.id)
    }
    showContextMenu.value = false
    contextMenuView.value = null
}

const handleClearFilters = () => {
    emit('clearFilters')
    showFiltersPopover.value = false
}
</script>
