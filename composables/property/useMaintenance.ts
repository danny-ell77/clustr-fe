import { ref } from 'vue'
import type { MaintenanceItem } from '~/types/property'
import { $fetch } from 'ofetch'

const items = ref<MaintenanceItem[]>([])
let loaded = false

export function useMaintenance() {
    async function list() {
        if (!loaded) {
            const res = await $fetch<{ items: MaintenanceItem[] }>(`/api/property/maintenance`)
            items.value = res.items
            loaded = true
        }
        return items
    }

    async function add(item: MaintenanceItem) {
        const res = await $fetch<{ item: MaintenanceItem }>(`/api/property/maintenance`, {
            method: 'POST',
            body: item
        })
        items.value.push(res.item)
    }

    async function update(id: string, patch: Partial<MaintenanceItem>) {
        const res = await $fetch<{ item: MaintenanceItem }>(`/api/property/maintenance/${id}`, {
            method: 'PUT',
            body: patch
        })
        const i = items.value.findIndex(x => x.id === id)
        if (i >= 0) items.value[i] = res.item
    }

    function exportCsv() {
        const header = ['Title', 'Description', 'Assignee', 'DueDate', 'Priority', 'Status']
        const rows = items.value.map(i => [i.title, i.description, i.assignee, i.dueDate, i.priority, i.status])
        const csv = [header, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'maintenance.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    return { list, add, update, exportCsv }
}
