import { ref, computed, onMounted, type Ref, type ComputedRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { SavedView, FilterState } from '~/types/saved-views'

const STORAGE_KEY_PREFIX = 'saved_views_'
const MAX_VIEWS_PER_TABLE = 50

export interface UseSavedViewsReturn {
    filters: Ref<FilterState>
    savedViews: Ref<SavedView[]>
    activeViewId: Ref<string | null>
    activeView: ComputedRef<SavedView | undefined>
    persistedViews: ComputedRef<SavedView[]>
    applyFilters: (filters: FilterState) => void
    createView: (data: Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>) => SavedView
    updateView: (id: string, data: Partial<SavedView>) => void
    deleteView: (id: string) => void
    activateView: (id: string) => void
    resetFilters: () => void
    isLoading: Ref<boolean>
}

export function useSavedViews(tableId: string): UseSavedViewsReturn {
    const router = useRouter()
    const route = useRoute()

    const filters = ref<FilterState>({})
    const savedViews = ref<SavedView[]>([])
    const activeViewId = ref<string | null>(null)
    const isLoading = ref(true)

    const activeView = computed(() =>
        savedViews.value.find(v => v.id === activeViewId.value)
    )

    const persistedViews = computed(() =>
        savedViews.value.filter(v => v.persisted).sort((a, b) => a.createdAt - b.createdAt)
    )

    function generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    }

    function getStorageKey(): string {
        return `${STORAGE_KEY_PREFIX}${tableId}`
    }

    function saveToLocalStorage(): void {
        try {
            const data = {
                views: savedViews.value,
                activeViewId: activeViewId.value,
                lastUpdated: Date.now()
            }
            localStorage.setItem(getStorageKey(), JSON.stringify(data))
        } catch (error) {
            console.error('Failed to save to localStorage:', error)
        }
    }

    function loadFromLocalStorage(): void {
        try {
            const key = getStorageKey()
            const data = localStorage.getItem(key)
            if (data) {
                const parsed = JSON.parse(data)
                savedViews.value = parsed.views || []
                activeViewId.value = parsed.activeViewId || null
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error)
        }
    }

    function syncToUrl(newFilters: FilterState): void {
        const params = new URLSearchParams()

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return

            if (Array.isArray(value)) {
                params.set(key, value.join(','))
            } else if (value instanceof Date) {
                params.set(key, value.toISOString())
            } else if (typeof value === 'object') {
                params.set(key, JSON.stringify(value))
            } else {
                params.set(key, String(value))
            }
        })

        if (activeViewId.value) {
            params.set('view', activeViewId.value)
        }

        const newUrl = `${route.path}?${params.toString()}`
        router.replace(newUrl)
    }

    function loadFromUrl(): FilterState {
        const params = new URLSearchParams(window.location.search)
        const urlFilters: FilterState = {}

        params.forEach((value, key) => {
            if (key === 'view') {
                activeViewId.value = value
                return
            }

            if (value.includes(',')) {
                urlFilters[key] = value.split(',')
            } else if (!isNaN(Number(value)) && value !== '') {
                urlFilters[key] = Number(value)
            } else if (value === 'true' || value === 'false') {
                urlFilters[key] = value === 'true'
            } else {
                try {
                    urlFilters[key] = JSON.parse(value)
                } catch {
                    urlFilters[key] = value
                }
            }
        })

        return urlFilters
    }

    function applyFilters(newFilters: FilterState): void {
        filters.value = { ...filters.value, ...newFilters }

        Object.keys(filters.value).forEach(key => {
            if (filters.value[key] === null || filters.value[key] === undefined || filters.value[key] === '') {
                delete filters.value[key]
            }
        })

        syncToUrl(filters.value)

        if (activeViewId.value) {
            const view = savedViews.value.find(v => v.id === activeViewId.value)
            if (view) {
                view.filters = { ...filters.value }
                view.updatedAt = Date.now()
                saveToLocalStorage()
            }
        }
    }

    function createView(data: Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>): SavedView {
        if (savedViews.value.length >= MAX_VIEWS_PER_TABLE) {
            const oldestView = savedViews.value
                .filter(v => !v.persisted)
                .sort((a, b) => a.updatedAt - b.updatedAt)[0]

            if (oldestView) {
                deleteView(oldestView.id)
            } else {
                throw new Error(`Maximum of ${MAX_VIEWS_PER_TABLE} views reached`)
            }
        }

        const newView: SavedView = {
            ...data,
            id: generateId(),
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        savedViews.value.push(newView)
        saveToLocalStorage()

        return newView
    }

    function updateView(id: string, data: Partial<SavedView>): void {
        const view = savedViews.value.find(v => v.id === id)
        if (view) {
            Object.assign(view, data, { updatedAt: Date.now() })
            saveToLocalStorage()
        }
    }

    function deleteView(id: string): void {
        const index = savedViews.value.findIndex(v => v.id === id)
        if (index !== -1) {
            savedViews.value.splice(index, 1)
            if (activeViewId.value === id) {
                activeViewId.value = null
                resetFilters()
            }
            saveToLocalStorage()
        }
    }

    function activateView(id: string): void {
        const view = savedViews.value.find(v => v.id === id)
        if (view) {
            activeViewId.value = id
            filters.value = { ...view.filters }
            syncToUrl(filters.value)
            saveToLocalStorage()
        }
    }

    function resetFilters(): void {
        filters.value = {}
        activeViewId.value = null
        syncToUrl({})
        saveToLocalStorage()
    }

    function handlePopState(): void {
        const urlFilters = loadFromUrl()
        filters.value = urlFilters
    }

    function handleStorageChange(e: StorageEvent): void {
        if (e.key?.startsWith(STORAGE_KEY_PREFIX)) {
            loadFromLocalStorage()
        }
    }

    onMounted(() => {
        loadFromLocalStorage()

        const urlFilters = loadFromUrl()
        if (Object.keys(urlFilters).length > 0) {
            filters.value = urlFilters
        } else if (activeViewId.value) {
            const view = savedViews.value.find(v => v.id === activeViewId.value)
            if (view) {
                filters.value = { ...view.filters }
            }
        }

        isLoading.value = false

        window.addEventListener('popstate', handlePopState)
        window.addEventListener('storage', handleStorageChange)
    })

    return {
        filters,
        savedViews,
        activeViewId,
        activeView,
        persistedViews,
        applyFilters,
        createView,
        updateView,
        deleteView,
        activateView,
        resetFilters,
        isLoading
    }
}
