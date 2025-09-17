<template>
    <div class="w-full">
        <!-- Header slot for search, filters, and actions -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <slot name="header">
                <!-- Default header content -->
                <div class="flex items-center space-x-4">
                    <slot name="header-left" />
                </div>
                <div class="flex items-center space-x-2">
                    <slot name="header-right" />
                </div>
            </slot>
        </div>

        <!-- Loading overlay slot -->
        <slot name="loading">
            <div v-if="loading" class="relative">
                <div class="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                    <div class="flex items-center space-x-2">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span class="text-sm text-gray-600">Loading...</span>
                    </div>
                </div>
            </div>
        </slot>

        <!-- Table content -->
        <div class="overflow-x-auto">
            <Table>
                <TableHeader>
                    <slot name="table-header">
                        <TableRow>
                            <slot name="column-headers" />
                        </TableRow>
                    </slot>
                </TableHeader>
                <TableBody>
                    <slot name="table-body">
                        <!-- Empty state -->
                        <TableRow v-if="isEmpty as boolean">
                            <TableCell :colspan="columnCount" class="h-24 text-center">
                                <slot name="empty-state">
                                    <div class="flex flex-col items-center space-y-2">
                                        <Icon name="inbox" class="w-8 h-8 text-gray-400" />
                                        <span class="text-gray-500">{{ emptyMessage }}</span>
                                    </div>
                                </slot>
                            </TableCell>
                        </TableRow>
                    </slot>
                </TableBody>
            </Table>
        </div>

        <!-- Footer slot for pagination or custom content -->
        <slot name="footer">
            <div class="px-6 py-4 border-t border-gray-200">
                <slot name="footer-content" />
            </div>
        </slot>
    </div>
</template>

<script setup lang="ts">
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHeader, 
    TableRow 
} from '~/components/ui/table'
import Icon from '~/components/Icon.vue'

interface BaseTableProps {
    loading?: boolean
    isEmpty?: boolean
    emptyMessage?: string
    columnCount?: number
}

withDefaults(defineProps<BaseTableProps>(), {
    loading: false,
    isEmpty: false,
    emptyMessage: 'No results found',
    columnCount: 1
})
</script>
