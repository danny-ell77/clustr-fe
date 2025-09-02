import { ref } from 'vue'
import type { Meeting } from '~/types/portal'
import { $fetch } from 'ofetch'

const events = ref<Meeting[]>([])
let loaded = false

export function useMeetings(){
  async function list(){
    if (!loaded) {
      const res = await $fetch<{ events: Meeting[] }>(`/api/portal/meetings`)
      events.value = res.events
      loaded = true
    }
    return events
  }
  async function create(m: Meeting){
    const res = await $fetch<{ event: Meeting }>(`/api/portal/meetings`, { method:'POST', body: m })
    events.value.push(res.event)
  }
  return { list, create }
}
