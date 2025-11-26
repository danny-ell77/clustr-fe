import { ref, computed, watch } from 'vue'

export interface DataTableColumn {
    key: string
    label: string
    sortable?: boolean
    width?: string
}

export interface DataTablePagination {
    page: number
    pageSize: number
    total: number
}

export interface DataTableSort {
    column: string
    direction: 'asc' | 'desc'
}

export interface UseDataTableOptions {
    initialPage?: number
    initialPageSize?: number
    initialSort?: DataTableSort
}

export const useDataTable = (options: UseDataTableOptions = {}) => {
    const page = ref(options.initialPage || 1)
    const pageSize = ref(options.initialPageSize || 20)
    const sortBy = ref(options.initialSort?.column || '')
    const sortOrder = ref<'asc' | 'desc'>(options.initialSort?.direction || 'asc')

    const ordering = computed(() => {
        if (!sortBy.value) return undefined
        return sortOrder.value === 'desc' ? `-${sortBy.value}` : sortBy.value
    })

    const handleSort = (column: string) => {
        if (sortBy.value === column) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortBy.value = column
            sortOrder.value = 'asc'
        }
        page.value = 1
    }

    const handlePageChange = (newPage: number) => {
        page.value = newPage
    }

    const handlePageSizeChange = (newPageSize: number) => {
        pageSize.value = newPageSize
        page.value = 1
    }

    const resetPagination = () => {
        page.value = 1
    }

    const resetSort = () => {
        sortBy.value = ''
        sortOrder.value = 'asc'
    }

    const reset = () => {
        resetPagination()
        resetSort()
    }

    return {
        page,
        pageSize,
        sortBy,
        sortOrder,
        ordering,
        handleSort,
        handlePageChange,
        handlePageSizeChange,
        resetPagination,
        resetSort,
        reset
    }
}
