import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { helpdeskApi, type IssueTicketFilters } from '~/services/api/helpdesk.api'
import { queryKeys } from '~/constants/query-keys'
import type {
    CreateIssueTicketDto,
    UpdateIssueTicketDto,
    CreateIssueCommentDto
} from '~/types/helpdesk'

export const useHelpdesk = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useTickets = (filters: Ref<IssueTicketFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.helpdesk.issues.list(filters.value)),
            queryFn: () => helpdeskApi.tickets.getAll(filters.value)
        })
    }

    const useTicket = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.helpdesk.issues.detail(id.value!)),
            queryFn: () => helpdeskApi.tickets.getById(id.value!),
            enabled: computed(() => !!id.value)
        })
    }

    const useTicketStats = () => {
        return useQuery({
            queryKey: queryKeys.helpdesk.issues.statistics(),
            queryFn: () => helpdeskApi.tickets.getStatistics(),
            refetchInterval: 30000
        })
    }

    const createTicketMutation = useMutation({
        mutationFn: (data: CreateIssueTicketDto) =>
            helpdeskApi.tickets.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.all() })
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.statistics() })
            toast.success('Ticket created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create ticket', error.message || 'Please try again')
        }
    })

    const updateTicketMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateIssueTicketDto }) =>
            helpdeskApi.tickets.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.all() })
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.statistics() })
            toast.success('Ticket updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update ticket', error.message || 'Please try again')
        }
    })

    const assignTicketMutation = useMutation({
        mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string }) =>
            helpdeskApi.tickets.assign(id, assignedTo),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.all() })
            toast.success('Ticket assigned successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to assign ticket', error.message || 'Please try again')
        }
    })

    const escalateTicketMutation = useMutation({
        mutationFn: (id: string) =>
            helpdeskApi.tickets.escalate(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.detail(id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.all() })
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.statistics() })
            toast.success('Ticket escalated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to escalate ticket', error.message || 'Please try again')
        }
    })

    const addCommentMutation = useMutation({
        mutationFn: ({ issueId, data }: { issueId: string; data: CreateIssueCommentDto }) =>
            helpdeskApi.comments.create(issueId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.comments(variables.issueId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.helpdesk.issues.detail(variables.issueId) })
            toast.success('Comment added successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to add comment', error.message || 'Please try again')
        }
    })

    return {
        useTickets,
        useTicket,
        useTicketStats,
        createTicketMutation,
        updateTicketMutation,
        assignTicketMutation,
        escalateTicketMutation,
        addCommentMutation
    }
}
