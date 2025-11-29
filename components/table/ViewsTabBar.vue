<template>
    <div class="bg-muted/30 border-b">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-1 overflow-x-auto flex-1 px-2 pt-2">
                <button v-for="view in persistedViews" :key="view.id" :class="[
                    'group relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-all rounded-t-lg',
                    'flex items-center gap-2 min-w-[120px] max-w-[200px]',
                    activeViewId === view.id
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                ]" :aria-selected="activeViewId === view.id" :aria-label="`View: ${view.name}`" role="tab"
                    @click="activateView(view.id)" @contextmenu.prevent="openContextMenu(view, $event)">
                    <span class="truncate flex-1">{{ view.name }}</span>
                    <button v-if="persistedViews.length > 1"
                        class="opacity-0 group-hover:opacity-100 hover:bg-muted/80 rounded p-0.5 transition-opacity"
                        @click.stop="confirmDelete(view)">
                        <Icon name="x" class="w-3 h-3" />
                    </button>
                </button>

                <button
                    class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-t-lg transition-colors"
                    aria-label="Create new view" @click="$emit('create')">
                    <Icon name="plus" class="w-4 h-4" />
                </button>
            </div>

            <div class="flex items-center gap-2 px-4 pt-2">
                <div v-if="showViewSwitcher" class="flex items-center border rounded-md bg-background">
                    <Button variant="ghost" size="sm" :class="[
                        'rounded-r-none h-8',
                        currentViewMode === 'grid' ? 'bg-muted' : ''
                    ]" @click="$emit('switchView', 'grid')">
                        <Icon name="grid" class="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" :class="[
                        'rounded-l-none h-8',
                        currentViewMode === 'table' ? 'bg-muted' : ''
                    ]" @click="$emit('switchView', 'table')">
                        <Icon name="table" class="w-4 h-4" />
                    </Button>
                </div>

                <Popover v-model:open="showFiltersPopover">
                    <PopoverTrigger as-child>
                        <Button variant="outline" size="sm" class="gap-2 h-8">
                            <Icon name="filter" class="w-4 h-4" />
                            Filter
                            <span v-if="activeFilterCount > 0"
                                class="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
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

        <DropdownMenu v-if="contextMenuView" v-model:open="showContextMenu">
            <DropdownMenuTrigger as-child>
                <div :style="{ position: 'absolute', left: `${contextMenuX}px`, top: `${contextMenuY}px` }" />
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
