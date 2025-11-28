import { useAuth } from '~/composables/auth/useAuth'

export const PERMISSIONS = {
  ACCOUNTS: {
    VIEW_ACCOUNT_USER: 'accounts.view_account_user',
    MANAGE_ACCOUNT_USER: 'accounts.manage_account_user',
    VIEW_RESIDENTS: 'accounts.view_residents',
    MANAGE_RESIDENTS: 'accounts.manage_residents',
    VIEW_ROLES: 'accounts.view_roles',
    MANAGE_ROLES: 'accounts.manage_roles',
  },
  COMMUNICATIONS: {
    VIEW_EMERGENCY: 'communications.view_emergency',
    MANAGE_EMERGENCY: 'communications.manage_emergency',
    VIEW_EMERGENCY_CONTACTS: 'communications.view_emergency_contacts',
    MANAGE_EMERGENCY_CONTACTS: 'communications.manage_emergency_contacts',
    VIEW_COMPLAINT: 'communications.view_complaint',
    MANAGE_COMPLAINT: 'communications.manage_complaint',
    VIEW_ANNOUNCEMENT: 'communications.view_announcement',
    MANAGE_ANNOUNCEMENT: 'communications.manage_announcement',
    VIEW_OPTIONS: 'communications.view_options',
    MANAGE_OPTIONS: 'communications.manage_options',
    VIEW_POLL: 'communications.view_poll',
    MANAGE_POLL: 'communications.manage_poll',
    CHANGE_POLL_SETTINGS: 'communications.change_poll_settings',
    VIEW_RESPONSES: 'communications.view_responses',
    MANAGE_RESPONSES: 'communications.manage_responses',
    VIEW_CHAT: 'communications.view_chat',
    MANAGE_CHAT: 'communications.manage_chat',
    MODERATE_CHAT: 'communications.moderate_chat',
    VIEW_MEETING: 'communications.view_meeting',
    MANAGE_MEETING: 'communications.manage_meeting',
    RECORD_MEETING: 'communications.record_meeting',
  },
  PAYMENTS: {
    VIEW_BILL: 'payments.view_bill',
    MANAGE_BILL: 'payments.manage_bill',
    VIEW_WALLET: 'payments.view_wallet',
    MANAGE_WALLET: 'payments.manage_wallet',
    VIEW_TRANSACTIONS: 'payments.view_transactions',
    MANAGE_TRANSACTIONS: 'payments.manage_transactions',
  },
  FACILITY_ADMIN: {
    VIEW_WORK_SHIFT: 'facility_admin.view_work_shift',
    MANAGE_WORK_SHIFT: 'facility_admin.manage_work_shift',
    VIEW_WORK_TASK: 'facility_admin.view_work_task',
    MANAGE_WORK_TASK: 'facility_admin.manage_work_task',
  },
  ACCESS_CONTROL: {
    VIEW_INVITATION: 'access_control.view_invitation',
    MANAGE_INVITATION: 'access_control.manage_invitation',
    VIEW_VISIT_REQUEST: 'access_control.view_visit_request',
    MANAGE_VISIT_REQUEST: 'access_control.manage_visit_request',
    VIEW_GUEST: 'access_control.view_guest',
    MANAGE_GUEST: 'access_control.manage_guest',
    VIEW_EVENT: 'access_control.view_event',
    MANAGE_EVENT: 'access_control.manage_event',
    VIEW_WARD: 'access_control.view_ward',
    MANAGE_WARD: 'access_control.manage_ward',
    VIEW_EXIT: 'access_control.view_exit',
    MANAGE_EXIT: 'access_control.manage_exit',
  },
  MARKETPLACE: {
    VIEW_SELLER: 'marketplace.view_seller',
    MANAGE_SELLER: 'marketplace.manage_seller',
    VIEW_POST: 'marketplace.view_post',
    MANAGE_POST: 'marketplace.manage_post',
    VIEW_TAGS: 'marketplace.view_tags',
    MANAGE_TAGS: 'marketplace.manage_tags',
    VIEW_REVIEW: 'marketplace.view_review',
    MANAGE_REVIEW: 'marketplace.manage_review',
  },
  SECURITY: {
    VIEW_SECURITY_LOG: 'security.view_security_log',
    MANAGE_SECURITY_LOG: 'security.manage_security_log',
    VIEW_SECURITY_ALERT: 'security.view_security_alert',
    MANAGE_SECURITY_ALERT: 'security.manage_security_alert',
  },
  ADMIN: {
    VIEW_CLUSTER_SETTINGS: 'admin.view_cluster_settings',
    MANAGE_CLUSTER_SETTINGS: 'admin.manage_cluster_settings',
    VIEW_AUDIT_LOG: 'admin.view_audit_log',
    MANAGE_AUDIT_LOG: 'admin.manage_audit_log',
    VIEW_SYSTEM_SETTINGS: 'admin.view_system_settings',
    MANAGE_SYSTEM_SETTINGS: 'admin.manage_system_settings',
  },
  DOCUMENTATION: {
    VIEW_DOCUMENTS: 'documentation.view_documents',
    MANAGE_DOCUMENTS: 'documentation.manage_documents',
  },
  NOTIFICATIONS: {
    VIEW_NOTIFICATIONS: 'notifications.view_notifications',
    MANAGE_NOTIFICATIONS: 'notifications.manage_notifications',
    RECEIVE_NOTIFICATIONS: 'notifications.receive_notifications',
  },
  SERVICES: {
    VIEW_HANDY_MEN: 'services.view_handy_men',
    MANAGE_HANDY_MEN: 'services.manage_handy_men',
    VIEW_DOMESTIC_STAFF: 'services.view_domestic_staff',
    MANAGE_DOMESTIC_STAFF: 'services.manage_domestic_staff',
    STAFF_TRACKER: 'services.staff_tracker',
  },
  PROFILE: {
    VIEW_PROFILE: 'profile.view_profile',
    MANAGE_PROFILE: 'profile.manage_profile',
    VIEW_SETTINGS: 'profile.view_settings',
    MANAGE_SETTINGS: 'profile.manage_settings',
  },
  STAFF_TRACKER: {
    VIEW_WORK_SHIFT: 'facility_admin.view_work_shift',
    MANAGE_WORK_SHIFT: 'facility_admin.manage_work_shift',
    VIEW_WORK_TASK: 'facility_admin.view_work_task',
    MANAGE_WORK_TASK: 'facility_admin.manage_work_task',
  }
} as const;

export const ROLES = {
  SECURITY: {
    name: 'Security',
    permissions: [
      PERMISSIONS.ACCESS_CONTROL.VIEW_INVITATION,
      PERMISSIONS.ACCESS_CONTROL.MANAGE_INVITATION,
      PERMISSIONS.ACCESS_CONTROL.VIEW_VISIT_REQUEST,
      PERMISSIONS.ACCESS_CONTROL.MANAGE_VISIT_REQUEST,
      PERMISSIONS.ACCESS_CONTROL.VIEW_GUEST,
      PERMISSIONS.ACCESS_CONTROL.MANAGE_GUEST,
      PERMISSIONS.ACCESS_CONTROL.VIEW_EXIT,
      PERMISSIONS.ACCESS_CONTROL.MANAGE_EXIT,
      PERMISSIONS.SECURITY.VIEW_SECURITY_LOG,
      PERMISSIONS.SECURITY.MANAGE_SECURITY_LOG,
      PERMISSIONS.SECURITY.VIEW_SECURITY_ALERT,
      PERMISSIONS.SECURITY.MANAGE_SECURITY_ALERT,
    ]
  },
  FACILITY_MANAGER: {
    name: 'Facility Manager',
    permissions: [
      PERMISSIONS.FACILITY_ADMIN.VIEW_WORK_SHIFT,
      PERMISSIONS.FACILITY_ADMIN.MANAGE_WORK_SHIFT,
      PERMISSIONS.FACILITY_ADMIN.VIEW_WORK_TASK,
      PERMISSIONS.FACILITY_ADMIN.MANAGE_WORK_TASK,
      PERMISSIONS.SERVICES.VIEW_HANDY_MEN,
      PERMISSIONS.SERVICES.MANAGE_HANDY_MEN,
      PERMISSIONS.SERVICES.VIEW_DOMESTIC_STAFF,
      PERMISSIONS.SERVICES.MANAGE_DOMESTIC_STAFF,
    ]
  },
  COMMUNICATIONS_OFFICER: {
    name: 'Communications Officer',
    permissions: [
      PERMISSIONS.COMMUNICATIONS.VIEW_ANNOUNCEMENT,
      PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT,
      PERMISSIONS.COMMUNICATIONS.VIEW_COMPLAINT,
      PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT,
      PERMISSIONS.COMMUNICATIONS.VIEW_POLL,
      PERMISSIONS.COMMUNICATIONS.MANAGE_POLL,
      PERMISSIONS.COMMUNICATIONS.VIEW_CHAT,
      PERMISSIONS.COMMUNICATIONS.MANAGE_CHAT,
      PERMISSIONS.COMMUNICATIONS.MODERATE_CHAT,
      PERMISSIONS.NOTIFICATIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.NOTIFICATIONS.MANAGE_NOTIFICATIONS,
    ]
  },
  FINANCE_OFFICER: {
    name: 'Finance Officer',
    permissions: [
      PERMISSIONS.PAYMENTS.VIEW_BILL,
      PERMISSIONS.PAYMENTS.MANAGE_BILL,
      PERMISSIONS.PAYMENTS.VIEW_WALLET,
      PERMISSIONS.PAYMENTS.MANAGE_WALLET,
      PERMISSIONS.PAYMENTS.VIEW_TRANSACTIONS,
      PERMISSIONS.PAYMENTS.MANAGE_TRANSACTIONS,
    ]
  }
} as const;

export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  return {
    PERMISSIONS,
    ROLES,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};