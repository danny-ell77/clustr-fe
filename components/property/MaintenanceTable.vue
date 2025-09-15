<template>
    <div class="overflow-x-auto">
        <table class="w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        @click="sortBy('title')">
                        <div class="flex items-center gap-1">
                            Title
                            <Icon name="chevron-up" class="w-3 h-3"
                                v-if="sortField === 'title' && sortDirection === 'asc'" />
                            <Icon name="chevron-down" class="w-3 h-3"
                                v-if="sortField === 'title' && sortDirection === 'desc'" />
                        </div>
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        @click="sortBy('priority')">
                        <div class="flex items-center gap-1">
                            Priority
                            <Icon name="chevron-up" class="w-3 h-3"
                                v-if="sortField === 'priority' && sortDirection === 'asc'" />
                            <Icon name="chevron-down" class="w-3 h-3"
                                v-if="sortField === 'priority' && sortDirection === 'desc'" />
                        </div>
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        @click="sortBy('assignee')">
                        <div class="flex items-center gap-1">
                            Assigned To
                            <Icon name="chevron-up" class="w-3 h-3"
                                v-if="sortField === 'assignee' && sortDirection === 'asc'" />
                            <Icon name="chevron-down" class="w-3 h-3"
                                v-if="sortField === 'assignee' && sortDirection === 'desc'" />
                        </div>
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        @click="sortBy('dueDate')">
                        <div class="flex items-center gap-1">
                            Due Date
                            <Icon name="chevron-up" class="w-3 h-3"
                                v-if="sortField === 'dueDate' && sortDirection === 'asc'" />
                            <Icon name="chevron-down" class="w-3 h-3"
                                v-if="sortField === 'dueDate' && sortDirection === 'desc'" />
                        </div>
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        @click="sortBy('status')">
                        <div class="flex items-center gap-1">
                            Status
                            <Icon name="chevron-up" class="w-3 h-3"
                                v-if="sortField === 'status' && sortDirection === 'asc'" />
                            <Icon name="chevron-down" class="w-3 h-3"
                                v-if="sortField === 'status' && sortDirection === 'desc'" />
                        </div>
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in sortedItems" :key="item.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-gray-600 max-w-xs truncate" :title="item.description">
                            {{ item.description }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <Badge :variant="getPriorityVariant(item.priority)" class="capitalize">
                            {{ item.priority }}
                        </Badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ item.assignee }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ formatDate(item.dueDate) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <Badge :variant="getStatusVariant(item.status)" class="capitalize">
                            {{ item.status.replace('-', ' ') }}
                        </Badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" @click="$emit('edit', item)">
                                <Icon name="edit" class="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" @click="$emit('delete', item)"
                                class="text-red-600 hover:text-red-700">
                                <Icon name="trash" class="w-4 h-4" />
                            </Button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Empty state -->
        <div v-if="sortedItems.length === 0" class="text-center py-12">
            <Icon name="clipboard-list" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No maintenance items found</h3>
            <p class="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'

const props = defineProps({
    items: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['edit', 'delete'])

const sortField = ref('dueDate')
const sortDirection = ref('asc')

const sortedItems = computed(() => {
    const items = [...props.items]

    return items.sort((a, b) => {
        let aValue = a[sortField.value]
        let bValue = b[sortField.value]

        // Handle date sorting
        if (sortField.value === 'dueDate') {
            aValue = new Date(aValue)
            bValue = new Date(bValue)
        }

        // Handle priority sorting (high > medium > low)
        if (sortField.value === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            aValue = priorityOrder[aValue] || 0
            bValue = priorityOrder[bValue] || 0
        }

        if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
        return 0
    })
})

const sortBy = (field) => {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortDirection.value = 'asc'
    }
}

const getPriorityVariant = (priority) => {
    switch (priority) {
        case 'high': return 'destructive'
        case 'medium': return 'default'
        case 'low': return 'secondary'
        default: return 'secondary'
    }
}

const getStatusVariant = (status) => {
    switch (status) {
        case 'completed': return 'default'
        case 'in_progress': return 'secondary'
        case 'scheduled': return 'outline'
        case 'overdue': return 'destructive'
        default: return 'secondary'
    }
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>