import { ref } from 'vue'
import type { Meeting } from '~/types/portal'
import { portalApi } from '~/services/api/portal.api'

const events = ref<Meeting[]>([])
let loaded = false

export function useMeetings() {
    async function list() {
        if (!loaded) {
            const res = await portalApi.meetings.getAll()
            events.value = res.events
            loaded = true
        }
        return events
    }

    async function create(m: Meeting) {
        const res = await portalApi.meetings.create(m)
        events.value.push(res.event)
    }

    return { list, create }
}
