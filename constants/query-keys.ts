/**
 * Centralized query key factory for TanStack Query
 * 
 * Hierarchical structure enables smart cache invalidation:
 * - Invalidate all bills: queryKeys.bills.all
 * - Invalidate all bill lists: queryKeys.bills.lists()
 * - Invalidate specific bill: queryKeys.bills.detail('bill-123')
 */

export const queryKeys = {
    // Bills domain
    bills: {
        all: ['bills'] as const,
        lists: () => [...queryKeys.bills.all, 'list'] as const,
        list: (filters: Record<string, any>) =>
            [...queryKeys.bills.lists(), filters] as const,
        details: () => [...queryKeys.bills.all, 'detail'] as const,
        detail: (id: string) =>
            [...queryKeys.bills.details(), id] as const,
        infinite: (filters: Record<string, any>) =>
            [...queryKeys.bills.all, 'infinite', filters] as const,
        dashboard: () => [...queryKeys.bills.all, 'dashboard'] as const,
    },

    // Payments domain
    payments: {
        all: ['payments'] as const,
        transactions: {
            all: () => [...queryKeys.payments.all, 'transactions'] as const,
            list: (filters: any) =>
                [...queryKeys.payments.transactions.all(), filters] as const,
            detail: (id: string) =>
                [...queryKeys.payments.transactions.all(), id] as const,
        },
        wallet: () => [...queryKeys.payments.all, 'wallet'] as const,
        recurringPayments: {
            all: () => [...queryKeys.payments.all, 'recurring'] as const,
            list: (filters: any) =>
                [...queryKeys.payments.recurringPayments.all(), filters] as const,
            detail: (id: string) =>
                [...queryKeys.payments.recurringPayments.all(), id] as const,
        },
    },

    // Announcements domain
    announcements: {
        all: ['announcements'] as const,
        lists: () => [...queryKeys.announcements.all, 'list'] as const,
        list: (filters: any) =>
            [...queryKeys.announcements.lists(), filters] as const,
        detail: (id: string) =>
            [...queryKeys.announcements.all, 'detail', id] as const,
        published: () =>
            [...queryKeys.announcements.all, 'published'] as const,
    },

    // Maintenance domain
    maintenance: {
        all: ['maintenance'] as const,
        logs: {
            all: () => [...queryKeys.maintenance.all, 'logs'] as const,
            list: (filters: any) =>
                [...queryKeys.maintenance.logs.all(), filters] as const,
            detail: (id: string) =>
                [...queryKeys.maintenance.logs.all(), id] as const,
        },
        schedules: {
            all: () => [...queryKeys.maintenance.all, 'schedules'] as const,
            list: (filters: any) =>
                [...queryKeys.maintenance.schedules.all(), filters] as const,
            upcoming: () =>
                [...queryKeys.maintenance.schedules.all(), 'upcoming'] as const,
        },
        analytics: () => [...queryKeys.maintenance.all, 'analytics'] as const,
    },

    // Helpdesk domain
    helpdesk: {
        all: ['helpdesk'] as const,
        issues: {
            all: () => [...queryKeys.helpdesk.all, 'issues'] as const,
            list: (filters: any) =>
                [...queryKeys.helpdesk.issues.all(), filters] as const,
            detail: (id: string) =>
                [...queryKeys.helpdesk.issues.all(), id] as const,
            statistics: () =>
                [...queryKeys.helpdesk.issues.all(), 'statistics'] as const,
        },
        comments: (issueId: string) =>
            [...queryKeys.helpdesk.all, 'comments', issueId] as const,
    },

    // Shifts domain
    shifts: {
        all: ['shifts'] as const,
        lists: () => [...queryKeys.shifts.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.shifts.lists(), filters] as const,
        details: () => [...queryKeys.shifts.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.shifts.details(), id] as const,
        statistics: () => [...queryKeys.shifts.all, 'statistics'] as const,
        upcoming: () => [...queryKeys.shifts.all, 'upcoming'] as const,
        overdue: () => [...queryKeys.shifts.all, 'overdue'] as const,
        swapRequests: {
            all: () => [...queryKeys.shifts.all, 'swap-requests'] as const,
            list: (filters: any) => [...queryKeys.shifts.swapRequests.all(), filters] as const,
            detail: (id: string) => [...queryKeys.shifts.swapRequests.all(), id] as const,
            pending: () => [...queryKeys.shifts.swapRequests.all(), 'pending'] as const,
        },
        schedules: {
            all: () => [...queryKeys.shifts.all, 'schedules'] as const,
            staff: (staffId: string) => [...queryKeys.shifts.schedules.all(), 'staff', staffId] as const,
            allStaff: () => [...queryKeys.shifts.schedules.all(), 'all-staff'] as const,
        },
    },

    // Staff domain
    staff: {
        all: ['staff'] as const,
        list: (filters: any) => [...queryKeys.staff.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.staff.all, 'detail', id] as const,
        statistics: ['staff', 'statistics'] as const,
        shifts: (id: string, filters: any) => [...queryKeys.staff.all, id, 'shifts', filters] as const,
    },

    // Emergency domain
    emergency: {
        all: ['emergency'] as const,
        alerts: {
            all: () => [...queryKeys.emergency.all, 'alerts'] as const,
            list: (filters: any) =>
                [...queryKeys.emergency.alerts.all(), filters] as const,
            detail: (id: string) =>
                [...queryKeys.emergency.alerts.all(), id] as const,
            active: () =>
                [...queryKeys.emergency.alerts.all(), 'active'] as const,
        },
        contacts: () => [...queryKeys.emergency.all, 'contacts'] as const,
        responses: (alertId: string) =>
            [...queryKeys.emergency.all, 'responses', alertId] as const,
    },

    // Users domain
    users: {
        all: ['users'] as const,
        list: (filters: any) => [...queryKeys.users.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
        roles: () => [...queryKeys.users.all, 'roles'] as const,
        permissions: (userId: string) =>
            [...queryKeys.users.all, 'permissions', userId] as const,
        staff: {
            all: () => [...queryKeys.users.all, 'staff'] as const,
            list: (filters: any) =>
                [...queryKeys.users.staff.all(), filters] as const,
        },
        residents: {
            all: () => [...queryKeys.users.all, 'residents'] as const,
            list: (filters: any) =>
                [...queryKeys.users.residents.all(), filters] as const,
        },
    },

    // Auth domain
    auth: {
        all: ['auth'] as const,
        user: () => [...queryKeys.auth.all, 'user'] as const,
        profile: () => [...queryKeys.auth.all, 'profile'] as const,
    },

    // Cluster domain
    cluster: {
        all: ['cluster'] as const,
        info: (slug: string) => [...queryKeys.cluster.all, 'info', slug] as const,
        settings: () => [...queryKeys.cluster.all, 'settings'] as const,
    },

    // Dashboard domain
    dashboard: {
        all: ['dashboard'] as const,
        stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
        residents: () => [...queryKeys.dashboard.all, 'residents'] as const,
        apartments: () => [...queryKeys.dashboard.all, 'apartments'] as const,
        revenue: (period?: string) => [...queryKeys.dashboard.all, 'revenue', period] as const,
        maintenance: () => [...queryKeys.dashboard.all, 'maintenance'] as const,
    },

    // Tasks domain
    tasks: {
        all: ['tasks'] as const,
        lists: () => [...queryKeys.tasks.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.tasks.lists(), filters] as const,
        details: () => [...queryKeys.tasks.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
        comments: (taskId: string) => [...queryKeys.tasks.all, 'comments', taskId] as const,
        statistics: () => [...queryKeys.tasks.all, 'statistics'] as const,
        overdue: () => [...queryKeys.tasks.all, 'overdue'] as const,
        dueSoon: () => [...queryKeys.tasks.all, 'due-soon'] as const,
    },

    // Children domain
    children: {
        all: ['children'] as const,
        lists: () => [...queryKeys.children.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.children.lists(), filters] as const,
        details: () => [...queryKeys.children.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.children.details(), id] as const,
        exitRequests: {
            all: () => [...queryKeys.children.all, 'exit-requests'] as const,
            list: (filters: any) => [...queryKeys.children.exitRequests.all(), filters] as const,
            detail: (id: string) => [...queryKeys.children.exitRequests.all(), id] as const,
            pending: () => [...queryKeys.children.exitRequests.all(), 'pending'] as const,
        },
        logs: {
            all: () => [...queryKeys.children.all, 'logs'] as const,
            list: (filters: any) => [...queryKeys.children.logs.all(), filters] as const,
            byChild: (childId: string) => [...queryKeys.children.logs.all(), 'by-child', childId] as const,
        },
    },

    // Events domain
    events: {
        all: ['events'] as const,
        lists: () => [...queryKeys.events.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.events.lists(), filters] as const,
        details: () => [...queryKeys.events.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.events.details(), id] as const,
        upcoming: () => [...queryKeys.events.all, 'upcoming'] as const,
        guests: {
            all: () => [...queryKeys.events.all, 'guests'] as const,
            list: (filters: any) => [...queryKeys.events.guests.all(), filters] as const,
            byEvent: (eventId: string) => [...queryKeys.events.guests.all(), 'by-event', eventId] as const,
        },
    },

    // Chat domain
    chat: {
        all: ['chat'] as const,
        conversations: {
            all: () => [...queryKeys.chat.all, 'conversations'] as const,
            list: (filters: any) => [...queryKeys.chat.conversations.all(), filters] as const,
            detail: (id: string) => [...queryKeys.chat.conversations.all(), id] as const,
        },
        messages: {
            all: () => [...queryKeys.chat.all, 'messages'] as const,
            list: (filters: any) => [...queryKeys.chat.messages.all(), filters] as const,
            byConversation: (conversationId: string) => [...queryKeys.chat.messages.all(), 'by-conversation', conversationId] as const,
        },
    },

    // Visitors domain
    visitors: {
        all: ['visitors'] as const,
        lists: () => [...queryKeys.visitors.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.visitors.lists(), filters] as const,
        details: () => [...queryKeys.visitors.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.visitors.details(), id] as const,
        active: () => [...queryKeys.visitors.all, 'active'] as const,
        logs: {
            all: () => [...queryKeys.visitors.all, 'logs'] as const,
            list: (filters: any) => [...queryKeys.visitors.logs.all(), filters] as const,
            byVisitor: (visitorId: string) => [...queryKeys.visitors.logs.all(), 'by-visitor', visitorId] as const,
        },
    },

    // Invitations domain
    invitations: {
        all: ['invitations'] as const,
        lists: () => [...queryKeys.invitations.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.invitations.lists(), filters] as const,
        details: () => [...queryKeys.invitations.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.invitations.details(), id] as const,
        pending: () => [...queryKeys.invitations.all, 'pending'] as const,
        expired: () => [...queryKeys.invitations.all, 'expired'] as const,
    },

    // Residents domain
    residents: {
        all: ['residents'] as const,
        lists: () => [...queryKeys.residents.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.residents.lists(), filters] as const,
        details: () => [...queryKeys.residents.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.residents.details(), id] as const,
        stats: () => [...queryKeys.residents.all, 'stats'] as const,
    },
} as const
