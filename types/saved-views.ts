export interface SavedView {
    id: string;
    name: string;
    filters: Record<string, any>;
    persisted: boolean;
    viewMode?: 'grid' | 'table';
    createdAt: number;
    updatedAt: number;
}

export interface FilterState {
    [key: string]: any;
}

export interface UseDataFiltersOptions {
    tableId: string;
    lazy?: boolean;
    autoSync?: boolean;
    storageKey?: string;
}
