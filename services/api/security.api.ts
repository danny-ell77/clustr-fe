import type { PaginatedResponse } from '~/types/api'
import type {
  Visitor,
  VisitorCreate,
  VisitorUpdate,
  Child,
  ChildCreate,
  ChildUpdate,
  EmergencyContact,
  EmergencyContactCreate,
  EmergencyContactUpdate,
  GatePass,
  GatePassCreate,
  PanicAlert,
  PanicAlertCreate,
  PanicAlertUpdate,
  Invitation,
  InvitationCreate,
  InvitationUpdate,
  InvitationRevoke,
  SOSAlert,
  SOSAlertCreate,
  SOSAlertUpdate,
  ExitRequest,
  ExitRequestCreate,
  ExitRequestUpdate,
  EntryExitLog,
  VisitorLog,
  Permission
} from '~/types/security'

export const securityApi = {
  visitors: {
    getAll: (params?: Record<string, any>) => {
      const { $api } = useNuxtApp()
      return $api<PaginatedResponse<Visitor>>('/management/visitors/', {
        method: 'GET',
        query: params
      })
    },

    getById: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<Visitor>(`/management/visitors/${id}/`, {
        method: 'GET'
      })
    },

    create: (data: VisitorCreate) => {
      const { $api } = useNuxtApp()
      return $api<Visitor>('/management/visitors/', {
        method: 'POST',
        body: data
      })
    },

    update: (id: string, data: VisitorUpdate) => {
      const { $api } = useNuxtApp()
      return $api<Visitor>(`/management/visitors/${id}/`, {
        method: 'PATCH',
        body: data
      })
    },

    delete: (id: string) => {
      const { $api } = useNuxtApp()
      return $api(`/management/visitors/${id}/`, {
        method: 'DELETE'
      })
    }
  },

  children: {
    getAll: (params?: Record<string, any>) => {
      const { $api } = useNuxtApp()
      return $api<PaginatedResponse<Child>>('/management/children/', {
        method: 'GET',
        query: params
      })
    },

    getById: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<Child>(`/management/children/${id}/`, {
        method: 'GET'
      })
    },

    create: (data: ChildCreate) => {
      const { $api } = useNuxtApp()
      return $api<Child>('/management/children/', {
        method: 'POST',
        body: data
      })
    },

    update: (id: string, data: ChildUpdate) => {
      const { $api } = useNuxtApp()
      return $api<Child>(`/management/children/${id}/`, {
        method: 'PATCH',
        body: data
      })
    },

    delete: (id: string) => {
      const { $api } = useNuxtApp()
      return $api(`/management/children/${id}/`, {
        method: 'DELETE'
      })
    }
  },

  emergencyContacts: {
    getAll: (params?: Record<string, any>) => {
      const { $api } = useNuxtApp()
      return $api<PaginatedResponse<EmergencyContact>>('/management/emergency-contacts/', {
        method: 'GET',
        query: params
      })
    },

    getById: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<EmergencyContact>(`/management/emergency-contacts/${id}/`, {
        method: 'GET'
      })
    },

    create: (data: EmergencyContactCreate) => {
      const { $api } = useNuxtApp()
      return $api<EmergencyContact>('/management/emergency-contacts/', {
        method: 'POST',
        body: data
      })
    },

    update: (id: string, data: EmergencyContactUpdate) => {
      const { $api } = useNuxtApp()
      return $api<EmergencyContact>(`/management/emergency-contacts/${id}/`, {
        method: 'PATCH',
        body: data
      })
    },

    delete: (id: string) => {
      const { $api } = useNuxtApp()
      return $api(`/management/emergency-contacts/${id}/`, {
        method: 'DELETE'
      })
    }
  },

  gatePasses: {
    getAll: (params?: Record<string, any>) => {
      const { $api } = useNuxtApp()
      return $api<PaginatedResponse<GatePass>>('/management/gate-passes/', {
        method: 'GET',
        query: params
      })
    },

    getById: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<GatePass>(`/management/gate-passes/${id}/`, {
        method: 'GET'
      })
    },

    create: (data: GatePassCreate) => {
      const { $api } = useNuxtApp()
      return $api<GatePass>('/management/gate-passes/', {
        method: 'POST',
        body: data
      })
    }
  },

  panicAlerts: {
    getAll: (params?: Record<string, any>) => {
      const { $api } = useNuxtApp()
      return $api<PaginatedResponse<PanicAlert>>('/management/panic-alerts/', {
        method: 'GET',
        query: params
      })
    },

    getById: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<PanicAlert>(`/management/panic-alerts/${id}/`, {
        method: 'GET'
      })
    },

    create: (data: PanicAlertCreate) => {
      const { $api } = useNuxtApp()
      return $api<PanicAlert>('/management/panic-alerts/', {
        method: 'POST',
        body: data
      })
    },

    update: (id: string, data: PanicAlertUpdate) => {
      const { $api } = useNuxtApp()
      return $api<PanicAlert>(`/management/panic-alerts/${id}/`, {
        method: 'PATCH',
        body: data
      })
    }
  },

  invitations: {
    getAll: (params?: Record<string, any>) => {
      const { $api } = useNuxtApp()
      return $api<PaginatedResponse<Invitation>>('/management/invitations/', {
        method: 'GET',
        query: params
      })
    },

    getById: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<Invitation>(`/management/invitations/${id}/`, {
        method: 'GET'
      })
    },

    create: (data: InvitationCreate) => {
      const { $api } = useNuxtApp()
      return $api<Invitation>('/management/invitations/', {
        method: 'POST',
        body: data
      })
    },

    update: (id: string, data: InvitationUpdate) => {
      const { $api } = useNuxtApp()
      return $api<Invitation>(`/management/invitations/${id}/`, {
        method: 'PATCH',
        body: data
      })
    },

    revoke: (id: string, data: InvitationRevoke) => {
      const { $api } = useNuxtApp()
      return $api<Invitation>(`/management/invitations/${id}/revoke/`, {
        method: 'POST',
        body: data
      })
    }
  },

  sosAlerts: {
    getAll: (params?: Record<string, any>) => {
      const { $api } = useNuxtApp()
      return $api<PaginatedResponse<SOSAlert>>('/management/sos-alerts/', {
        method: 'GET',
        query: params
      })
    },

    getById: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<SOSAlert>(`/management/sos-alerts/${id}/`, {
        method: 'GET'
      })
    },

    create: (data: SOSAlertCreate) => {
      const { $api } = useNuxtApp()
      return $api<SOSAlert>('/management/sos-alerts/', {
        method: 'POST',
        body: data
      })
    },

    update: (id: string, data: SOSAlertUpdate) => {
      const { $api } = useNuxtApp()
      return $api<SOSAlert>(`/management/sos-alerts/${id}/`, {
        method: 'PATCH',
        body: data
      })
    },

    acknowledge: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<SOSAlert>(`/management/sos-alerts/${id}/acknowledge/`, {
        method: 'POST'
      })
    },

    resolve: (id: string, notes?: string) => {
      const { $api } = useNuxtApp()
      return $api<SOSAlert>(`/management/sos-alerts/${id}/resolve/`, {
        method: 'POST',
        body: { resolutionNotes: notes }
      })
    },

    cancel: (id: string, reason?: string) => {
      const { $api } = useNuxtApp()
      return $api<SOSAlert>(`/management/sos-alerts/${id}/cancel/`, {
        method: 'POST',
        body: { cancellationReason: reason }
      })
    }
  },

  exitRequests: {
    getAll: (params?: Record<string, any>) => {
      const { $api } = useNuxtApp()
      return $api<PaginatedResponse<ExitRequest>>('/management/exit-requests/', {
        method: 'GET',
        query: params
      })
    },

    getById: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<ExitRequest>(`/management/exit-requests/${id}/`, {
        method: 'GET'
      })
    },

    create: (data: ExitRequestCreate) => {
      const { $api } = useNuxtApp()
      return $api<ExitRequest>('/management/exit-requests/', {
        method: 'POST',
        body: data
      })
    },

    update: (id: string, data: ExitRequestUpdate) => {
      const { $api } = useNuxtApp()
      return $api<ExitRequest>(`/management/exit-requests/${id}/`, {
        method: 'PATCH',
        body: data
      })
    },

    approve: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<ExitRequest>(`/management/exit-requests/${id}/approve/`, {
        method: 'POST'
      })
    },

    deny: (id: string, reason: string) => {
      const { $api } = useNuxtApp()
      return $api<ExitRequest>(`/management/exit-requests/${id}/deny/`, {
        method: 'POST',
        body: { denialReason: reason }
      })
    }
  },

  entryExitLogs: {
    getAll: (params?: Record<string, any>) => {
      const { $api } = useNuxtApp()
      return $api<PaginatedResponse<EntryExitLog>>('/management/entry-exit-logs/', {
        method: 'GET',
        query: params
      })
    },

    getById: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<EntryExitLog>(`/management/entry-exit-logs/${id}/`, {
        method: 'GET'
      })
    }
  },

  visitorLogs: {
    getAll: (params?: Record<string, any>) => {
      const { $api } = useNuxtApp()
      return $api<PaginatedResponse<VisitorLog>>('/management/visitor-logs/', {
        method: 'GET',
        query: params
      })
    },

    getById: (id: string) => {
      const { $api } = useNuxtApp()
      return $api<VisitorLog>(`/management/visitor-logs/${id}/`, {
        method: 'GET'
      })
    }
  },

  permissions: {
    getAll: () => {
      const { $api } = useNuxtApp()
      return $api<Permission[]>('/accounts/permissions/')
    }
  }
}
