export const APP_MODULES = [
    {
        id: 'property',
        label: 'Properties',
        icon: 'home',
        permission: 'property.overview.view',
        route: '/property'
    },
    {
        id: 'accounting',
        label: 'Accounting',
        icon: 'dollar-sign',
        permission: 'accounting.overview.view',
        route: '/accounting'
    },
    {
        id: 'security',
        label: 'Access Control',
        icon: 'key',
        permission: 'security.overview.view',
        route: '/security'
    },
    {
        id: 'shift',
        label: 'Shift Management',
        icon: 'calendar-clock',
        permission: 'shift.overview.view',
        route: '/shift'
    },
    {
        id: 'portal',
        label: 'Portal',
        icon: 'message-circle',
        permission: 'portal.overview.view',
        route: '/portal'
    }
] as const

export type ModuleId = typeof APP_MODULES[number]['id']
export type AppModule = typeof APP_MODULES[number]
