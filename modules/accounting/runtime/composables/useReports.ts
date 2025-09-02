import { ref } from 'vue'
import type { Report } from '~/types/accounting'
import { $fetch } from 'ofetch'

const reports = ref<Report[]>([])
let loaded = false

export function useReports(){
  async function list(){
    if (!loaded) {
      const res = await $fetch<{ reports: Report[] }>(`/api/accounting/reports`)
      reports.value = res.reports
      loaded = true
    }
    return reports
  }
  function getById(id: string){ return reports.value.find(r=>r.id===id) }
  async function update(id: string, patch: Partial<Report>){
    const res = await $fetch<{ report: Report }>(`/api/accounting/reports/${id}`, { method: 'PUT', body: patch })
    const i = reports.value.findIndex(r=>r.id===id); if (i>=0) reports.value[i] = res.report
  }
  return { list, getById, update }
}
