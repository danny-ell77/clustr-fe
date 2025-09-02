<template>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Reports</h2>
      <ReportFilters v-model:query="query" v-model:status="status" />
    </div>

    <div v-if="loading" class="space-y-2">
      <div class="h-8 bg-gray-100 rounded animate-pulse" />
      <div class="h-8 bg-gray-100 rounded animate-pulse" />
      <div class="h-8 bg-gray-100 rounded animate-pulse" />
    </div>
    <ReportTable v-else :reports="filtered" @open="open" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { definePageMeta, navigateTo } from '#imports'
import ReportFilters from '~/components/accounting/reports/ReportFilters.vue'
import ReportTable from '~/components/accounting/reports/ReportTable.vue'
import type { ReportStatus } from '~/types/accounting'
import { useReports } from '~/modules/accounting/runtime/composables/useReports'

const query = ref('')
const status = ref<'all' | ReportStatus>('all')
const { list } = useReports()
const loading = ref(true)
const reports = await list().finally(()=> loading.value=false)

const filtered = computed(() => reports.value.filter(r => (status.value==='all' || r.status===status.value) && `${r.date} ${r.name} ${r.assignee}`.toLowerCase().includes(query.value.toLowerCase())))

function open(id: string) { navigateTo(`/accounting/reports/${id}`) }

definePageMeta({ title: 'Reports', description: 'Generate financial reports', requiresPermission: 'accounting.reports.view' })
</script>
