<template>
    <BaseTable
        :loading="loading"
        :isEmpty="isEmpty"
        :emptyMessage="emptyMessage"
        :columnCount="columns.length + (showRowActions ? 1 : 0)"
    >
        <!-- Header -->
        <template #header>
            <div class="flex items-center space-x-4">
                <div class="relative" v-if="enableSearch">
                    <Input
                        v-model="searchQuery"
                        :placeholder="searchPlaceholder"
                        class="pl-10 w-64"
                        @input="onSearchChange"
                    />
                    <Icon
                        name="search"
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                    />
                </div>
                <Select v-if="enablePageSizeSelector" v-model="selectedPageSize" class="w-32" @update:model-value="onPageSizeChange">
                    <SelectTrigger>
                        <SelectValue :placeholder="selectedPageSize + ' per page'" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="size in pageSizeOptions" :key="size" :value="size">
                            {{ size }} per page
                        </SelectItem>
                    </SelectContent>
                </Select>
                <slot name="custom-filters" :apply-filters="applyFilters" :clear-filters="clearFilters" />
            </div>
            <div v-if="showActions" class="flex items-center space-x-2">
                <Button variant="outline" size="sm" @click="$emit('export')" :disabled="loading">
                    <Icon name="download" class="w-4 h-4 mr-2" />
                    Export
                </Button>
                <Button variant="outline" size="sm" @click="$emit('filter')">
                    <Icon name="filter" class="w-4 h-4 mr-2" />
                    Filter
                </Button>
                <slot name="custom-actions" />
            </div>
        </template>

        <!-- Column Headers -->
        <template #column-headers>
            <TableHead 
                v-for="column in columns" 
                :key="column.key"
                :class="{'text-right': column.align === 'right', 'cursor-pointer hover:bg-gray-50': column.sortable}"
                @click="column.sortable ? onSort(column.key) : null"
            >
                <div class="flex items-center space-x-1">
                    <span>{{ column.label }}</span>
                    <Icon 
                        v-if="column.sortable && sortKey === column.key" 
                        :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'" 
                        class="w-4 h-4" 
                    />
                    <Icon 
                        v-else-if="column.sortable" 
                        name="chevrons-up-down" 
                        class="w-4 h-4 opacity-30" 
                    />
                </div>
            </TableHead>
            <TableHead class="w-[100px]" v-if="showRowActions">Actions</TableHead>
        </template>

        <!-- Table Body -->
        <template #table-body>
            <TableRow 
                v-for="row in displayData" 
                :key="row[idKey]"
                class="hover:bg-gray-50"
            >
                <TableCell 
                    v-for="column in columns" 
                    :key="column.key"
                    :class="{'text-right': column.align === 'right'}"
                >
                    <div v-if="column.format">
                        {{ column.format(row[column.key], row) }}
                    </div>
                    <div v-else-if="column.component">
                        <component :is="column.component" :value="row[column.key]" :row="row" />
                    </div>
                    <div v-else>
                        {{ row[column.key] }}
                    </div>
                </TableCell>
                <TableCell v-if="showRowActions">
                    <DropdownMenu>
                        <DropdownMenuTrigger as="div">
                            <Button variant="ghost" size="icon">
                                <Icon name="more-vertical" class="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem 
                                v-for="action in rowActions" 
                                :key="action.key"
                                @click="$emit(action.key, row)"
                                :class="action.destructive ? 'text-red-600' : ''"
                                :disabled="action.disabled?.(row)"
                            >
                                <Icon :name="action.icon" class="w-4 h-4 mr-2" />
                                {{ action.label }}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            
            <!-- Loading state for additional rows -->
            <TableRow v-if="loading && displayData.length > 0">
                <TableCell :colspan="columns.length + (showRowActions ? 1 : 0)" class="h-12 text-center">
                    <div class="flex items-center justify-center space-x-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span class="text-sm text-gray-600">Loading more...</span>
                    </div>
                </TableCell>
            </TableRow>
        </template>

        <!-- Footer with Pagination -->
        <template #footer-content>
            <template v-if="mode === 'pagination'">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                        <span v-if="totalCount > 0">
                            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalCount }} entries
                        </span>
                        <span v-else>No entries found</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            :disabled="currentPage === 1 || loading"
                            @click="goToPage(currentPage - 1)"
                        >
                            Previous
                        </Button>
                        <Button 
                            v-for="page in pageNumbers" 
                            :key="page"
                            variant="outline"
                            size="sm"
                            :class="{'bg-blue-50 text-blue-600': currentPage === page}"
                            @click="goToPage(page)"
                            :disabled="loading"
                        >
                            {{ page }}
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            :disabled="currentPage === totalPages || loading || !hasNextPage"
                            @click="goToPage(currentPage + 1)"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </template>
            
            <!-- Infinite scroll trigger -->
            <template v-if="mode === 'infinite' && hasNextPage && !loading">
                <div 
                    ref="infiniteScrollTrigger"
                    class="flex items-center justify-center"
                >
                    <Button variant="outline" @click="loadMore" :disabled="loading">
                        <Icon name="refresh-cw" class="w-4 h-4 mr-2" />
                        Load More
                    </Button>
                </div>
            </template>
        </template>
    </BaseTable>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import BaseTable from './BaseTable.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '~/components/ui/table'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '~/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import Icon from '~/components/Icon.vue'
import {  type PaginatedResponse } from '~/composables/usePagination'


interface Column {
    key: string
    label: string
    align?: 'left' | 'right' | 'center'
    sortable?: boolean
    format?: (value: any, row: any) => string
    component?: any
}

interface RowAction {
    key: 'export' | 'filter' | 'view' | 'edit' | 'delete' | 'sort' | 'search' | 'page-change'
    label: string
    icon: string
    destructive?: boolean
    disabled?: (row: any) => boolean
}

interface GenericTableProps {
    // Data source
    data?: any[]
    fetchFn?: (params: any) => Promise<PaginatedResponse<any>>
    
    // Table configuration
    columns: Column[]
    idKey?: string
    
    // Pagination mode
    mode?: 'client' | 'server' | 'pagination' | 'infinite'
    pageSize?: number
    pageSizeOptions?: number[]
    enablePageSizeSelector?: boolean
    
    // Search and filtering
    enableSearch?: boolean
    searchPlaceholder?: string
    searchDebounceMs?: number
    
    // UI configuration
    emptyMessage?: string
    showActions?: boolean
    showRowActions?: boolean
    rowActions?: RowAction[]
    
    // Loading and error states
    loading?: boolean
    error?: string | null
    
    // Initial filters
    initialFilters?: Record<string, any>
}

const props = withDefaults(defineProps<GenericTableProps>(), {
    data: () => [],
    idKey: 'id',
    mode: 'client',
    pageSize: 20,
    pageSizeOptions: () => [10, 20, 50, 100],
    enablePageSizeSelector: true,
    enableSearch: true,
    searchPlaceholder: 'Search...',
    searchDebounceMs: 300,
    emptyMessage: 'No results found',
    showActions: true,
    showRowActions: true,
    rowActions: () => [
        { key: 'view', label: 'View', icon: 'eye' },
        { key: 'edit', label: 'Edit', icon: 'edit-2' },
        { key: 'delete', label: 'Delete', icon: 'trash-2', destructive: true }
    ],
    loading: false,
    error: null,
    initialFilters: () => ({})
})

// Dynamic emits
const emit = defineEmits()

// Reactive state
const searchQuery = ref('')
const selectedPageSize = ref(props.pageSize)
const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')
const infiniteScrollTrigger = ref<HTMLElement | null>(null)

// Server-side pagination integration
let paginationComposable: any = null

if (props.mode === 'server' || props.mode === 'infinite') {
    if (!props.fetchFn) {
        throw new Error('fetchFn is required for server-side pagination')
    }
    
    const { usePagination } = await import('~/composables/usePagination')
    paginationComposable = usePagination(props.fetchFn, {
        pageSize: selectedPageSize.value,
        initialFilters: props.initialFilters,
        infiniteScroll: props.mode === 'infinite'
    })
}

// Computed properties for server-side mode
const serverData = computed(() => paginationComposable?.items.value || [])
const serverLoading = computed(() => paginationComposable?.loading.value || false)
const serverError = computed(() => paginationComposable?.error.value || null)
const serverCurrentPage = computed(() => paginationComposable?.currentPage.value || 1)
const serverTotalCount = computed(() => paginationComposable?.totalCount.value || 0)
const serverTotalPages = computed(() => paginationComposable?.totalPages.value || 1)
const serverHasNextPage = computed(() => paginationComposable?.hasNextPage.value || false)
const serverIsEmpty = computed(() => paginationComposable?.isEmpty.value || false)

// Client-side filtering and sorting
const filteredAndSortedData = computed(() => {
    if (props.mode === 'server' || props.mode === 'infinite') {
        return serverData.value
    }
    
    let result = [...props.data]
    
    // Apply search filter
    if (searchQuery.value) {
        const searchLower = searchQuery.value.toLowerCase()
        result = result.filter(item => {
            return Object.values(item).some(val => {
                if (val === null || val === undefined) return false
                return String(val).toLowerCase().includes(searchLower)
            })
        })
    }
    
    // Apply sorting
    if (sortKey.value) {
        result.sort((a, b) => {
            const aVal = a[sortKey.value!]
            const bVal = b[sortKey.value!]
            
            if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
            if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
            return 0
        })
    }
    
    return result
})

// Client-side pagination
const currentPage = ref(1)
const clientTotalPages = computed(() => {
    if (props.mode === 'server' || props.mode === 'infinite') {
        return serverTotalPages.value
    }
    return Math.ceil(filteredAndSortedData.value.length / selectedPageSize.value)
})

const clientStartIndex = computed(() => {
    if (props.mode === 'infinite') return 0
    return (currentPage.value - 1) * selectedPageSize.value
})

const clientEndIndex = computed(() => {
    if (props.mode === 'infinite') {
        return filteredAndSortedData.value.length
    }
    return Math.min(clientStartIndex.value + selectedPageSize.value, filteredAndSortedData.value.length)
})

const clientPaginatedData = computed(() => {
    if (props.mode === 'infinite') {
        return filteredAndSortedData.value
    }
    return filteredAndSortedData.value.slice(clientStartIndex.value, clientEndIndex.value)
})

// Unified computed properties
const displayData = computed(() => {
    if (props.mode === 'server' || props.mode === 'infinite') {
        return serverData.value
    }
    return clientPaginatedData.value
})

const loading = computed(() => {
    if (props.mode === 'server' || props.mode === 'infinite') {
        return serverLoading.value
    }
    return props.loading
})

const totalCount = computed(() => {
    if (props.mode === 'server' || props.mode === 'infinite') {
        return serverTotalCount.value
    }
    return filteredAndSortedData.value.length
})

const totalPages = computed(() => {
    if (props.mode === 'server' || props.mode === 'infinite') {
        return serverTotalPages.value
    }
    return clientTotalPages.value
})

const hasNextPage = computed(() => {
    if (props.mode === 'server' || props.mode === 'infinite') {
        return serverHasNextPage.value
    }
    return currentPage.value < clientTotalPages.value
})

const isEmpty = computed(() => {
    if (props.mode === 'server' || props.mode === 'infinite') {
        return serverIsEmpty.value
    }
    return !loading.value && displayData.value.length === 0
})

const startIndex = computed(() => {
    if (props.mode === 'server' || props.mode === 'infinite') {
        return Math.max(0, (serverCurrentPage.value - 1) * selectedPageSize.value)
    }
    return clientStartIndex.value
})

const endIndex = computed(() => {
    if (props.mode === 'server' || props.mode === 'infinite') {
        return Math.min(startIndex.value + displayData.value.length, serverTotalCount.value)
    }
    return clientEndIndex.value
})

const pageNumbers = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = props.mode === 'server' || props.mode === 'infinite' ? serverCurrentPage.value : currentPage.value
    
    for (let i = 1; i <= total; i++) {
        if (
            i === 1 || 
            i === total || 
            (i >= current - 2 && i <= current + 2)
        ) {
            pages.push(i)
        }
    }
    return pages
})

// Methods
const onSort = (key: string) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortOrder.value = 'asc'
    }
    
    if (props.mode === 'server') {
        applyFilters({ ordering: `${sortOrder.value === 'desc' ? '-' : ''}${key}` })
    }
    
    emit('sort', { key, order: sortOrder.value })
}

const onSearchChange = (() => {
    let timeout: NodeJS.Timeout
    return () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            if (props.mode === 'server') {
                applyFilters({ search: searchQuery.value })
            } else {
                currentPage.value = 1
            }
            emit('search', searchQuery.value)
        }, props.searchDebounceMs)
    }
})()

const onPageSizeChange = () => {
    if (props.mode === 'server') {
        paginationComposable?.loadPage(1, true)
    } else {
        currentPage.value = 1
    }
}

const goToPage = (page: number) => {
    if (props.mode === 'server') {
        paginationComposable?.goToPage(page)
    } else {
        currentPage.value = page
    }
    emit('page-change', page)
}

const loadMore = () => {
    if (paginationComposable) {
        paginationComposable.loadMore()
    }
}

const applyFilters = (filters: Record<string, any>) => {
    if (paginationComposable) {
        paginationComposable.applyFilters(filters)
    }
}

const clearFilters = () => {
    if (paginationComposable) {
        paginationComposable.clearFilters()
    }
    searchQuery.value = ''
    sortKey.value = null
    sortOrder.value = 'asc'
}

const refresh = () => {
    if (paginationComposable) {
        paginationComposable.refresh()
    }
}

// Infinite scroll observer
let observer: IntersectionObserver | null = null

onMounted(() => {
    if (props.mode === 'infinite' && infiniteScrollTrigger.value) {
        observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage.value && !loading.value) {
                loadMore()
            }
        }, { threshold: 0.1 })
        
        nextTick(() => {
            if (infiniteScrollTrigger.value) {
                observer?.observe(infiniteScrollTrigger.value)
            }
        })
    }
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})

// Watch for data changes
watch([filteredAndSortedData, selectedPageSize], () => {
    if (props.mode === 'client' && currentPage.value > clientTotalPages.value) {
        currentPage.value = 1
    }
})

// Expose methods for parent components
defineExpose({
    refresh,
    applyFilters,
    clearFilters,
    goToPage,
    loadMore
})
</script>
