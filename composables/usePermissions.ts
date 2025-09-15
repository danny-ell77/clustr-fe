// Enhanced Permission System - Role-based Access Control
// Extends the existing useAuth composable with advanced permission utilities

import { computed, readonly } from "vue";

// Enhanced Permission System - Role-based Access Control
// Aligned with Django backend permissions structure

import { computed, readonly } from "vue";

// Permission constants matching Django backend
export const PERMISSIONS = {
  // Access Control Permissions
  ACCESS_CONTROL: {
    VIEW_INVITATION: "ViewInvitation",
    MANAGE_INVITATION: "ManageInvitation",
    VIEW_VISIT_REQUEST: "ViewVisitRequest",
    MANAGE_VISIT_REQUEST: "ManageVisitRequest",
    VIEW_GUEST: "ViewGuest",
    MANAGE_GUEST: "ManageGuest",
    VIEW_EVENT: "ViewEvent",
    MANAGE_EVENT: "ManageEvent",
    VIEW_WARD: "ViewWard",
    MANAGE_WARD: "ManageWard",
    VIEW_EXIT: "ViewExit",
    MANAGE_EXIT: "ManageExit",
  },

  // Accounts Permissions
  ACCOUNTS: {
    VIEW_ACCOUNT_USER: "ViewAccountUser",
    MANAGE_ACCOUNT_USER: "ManageAccountUser",
    VIEW_RESIDENTS: "ViewResidents",
    MANAGE_RESIDENTS: "ManageResidents",
    VIEW_ROLES: "ViewRoles",
    MANAGE_ROLES: "ManageRoles",
  },

  // Communications Permissions
  COMMUNICATIONS: {
    VIEW_EMERGENCY: "ViewEmergency",
    MANAGE_EMERGENCY: "ManageEmergency",
    VIEW_EMERGENCY_CONTACTS: "ViewEmergencyContacts",
    MANAGE_EMERGENCY_CONTACTS: "ManageEmergencyContacts",
    VIEW_COMPLAINT: "ViewComplaint",
    MANAGE_COMPLAINT: "ManageComplaint",
    VIEW_ANNOUNCEMENT: "ViewAnnouncement",
    MANAGE_ANNOUNCEMENT: "ManageAnnouncement",
    VIEW_POLL: "ViewPoll",
    MANAGE_POLL: "ManagePoll",
    CHANGE_POLL_SETTINGS: "ChangePollSettings",
    VIEW_OPTIONS: "ViewOptions",
    MANAGE_OPTIONS: "ManageOptions",
    VIEW_RESPONSES: "ViewResponses",
    MANAGE_RESPONSES: "ManageResponses",
  },

  // Documentation Permissions
  DOCUMENTATION: {
    VIEW_DOCUMENTS: "ViewDocuments",
    MANAGE_DOCUMENTS: "ManageDocuments",
  },

  // Facility Admin Permissions
  FACILITY_ADMIN: {
    VIEW_WORK_SHIFT: "ViewWorkShift",
    MANAGE_WORK_SHIFT: "ManageWorkShift",
    VIEW_WORK_TASK: "ViewWorkTask",
    MANAGE_WORK_TASK: "ManageWorkTask",
  },

  // Marketplace Permissions
  MARKETPLACE: {
    VIEW_SELLER: "ViewSeller",
    MANAGE_SELLER: "ManageSeller",
    VIEW_POST: "ViewPost",
    MANAGE_POST: "ManagePost",
    VIEW_TAGS: "ViewTags",
    MANAGE_TAGS: "ManageTags",
    VIEW_REVIEW: "ViewReview",
    MANAGE_REVIEW: "ManageReview",
  },

  // Notifications Permissions
  NOTIFICATIONS: {
    VIEW_NOTIFICATION: "ViewNotification",
    MANAGE_NOTIFICATION: "ManageNotification",
    RECEIVE_NOTIFICATIONS: "ReceiveNotifications",
  },

  // Payments Permissions
  PAYMENTS: {
    VIEW_WALLET: "ViewWallet",
    MANAGE_WALLET: "ManageWallet",
    VIEW_BILL: "ViewBill",
    MANAGE_BILL: "ManageBill",
    PAY_BILLS: "PayBills",
    VIEW_TRANSACTION: "ViewTransaction",
    MANAGE_TRANSACTION: "ManageTransaction",
  },

  // Servicemen Permissions
  SERVICEMEN: {
    VIEW_HANDY_MEN: "ViewHandyMen",
    MANAGE_HANDY_MEN: "ManageHandyMen",
  },

  // Staff Tracker Permissions
  STAFF_TRACKER: {
    VIEW_DOMESTIC_STAFF: "ViewDomesticStaff",
    MANAGE_DOMESTIC_STAFF: "ManageDomesticStaff",
  },

  // Security Permissions
  SECURITY: {
    VIEW_SECURITY_LOG: "ViewSecurityLog",
    MANAGE_SECURITY_LOG: "ManageSecurityLog",
    VIEW_EMERGENCY_RESPONSE: "ViewEmergencyResponse",
    MANAGE_EMERGENCY_RESPONSE: "ManageEmergencyResponse",
    VIEW_SECURITY_ALERT: "ViewSecurityAlert",
    MANAGE_SECURITY_ALERT: "ManageSecurityAlert",
  },

  // Admin Permissions
  ADMIN: {
    VIEW_CLUSTER_SETTINGS: "ViewClusterSettings",
    MANAGE_CLUSTER_SETTINGS: "ManageClusterSettings",
    VIEW_AUDIT_LOG: "ViewAuditLog",
    MANAGE_AUDIT_LOG: "ManageAuditLog",
    VIEW_SYSTEM_SETTINGS: "ViewSystemSettings",
    MANAGE_SYSTEM_SETTINGS: "ManageSystemSettings",
  },

  // Profile Permissions
  PROFILE: {
    VIEW_PROFILE: "ViewProfile",
    MANAGE_PROFILE: "ManageProfile",
    VIEW_SETTINGS: "ViewSettings",
    MANAGE_SETTINGS: "ManageSettings",
  },
} as const;

// Role definitions matching Django backend
export const ROLES = {
  // Primary Admin Role (matches PRIMARY_ROLE_NAME from Django)
  ADMIN: {
    name: "Admin",
    description: "Has full access to all account features and resources",
    hierarchy: 1,
    permissions: "*", // All permissions
  },

  SECURITY: {
    name: "Security",
    description: "Responsible for managing access control and security",
    hierarchy: 2,
    permissions: [
      // Access Control permissions
      ...Object.values(PERMISSIONS.ACCESS_CONTROL),
      // Security permissions
      ...Object.values(PERMISSIONS.SECURITY),
      // Emergency communications
      PERMISSIONS.COMMUNICATIONS.VIEW_EMERGENCY,
      PERMISSIONS.COMMUNICATIONS.MANAGE_EMERGENCY,
      PERMISSIONS.COMMUNICATIONS.VIEW_EMERGENCY_CONTACTS,
    ],
  },

  FACILITY_MANAGER: {
    name: "Facility Manager",
    description: "Responsible for managing cluster facilities and services",
    hierarchy: 3,
    permissions: [
      // Facility Admin permissions
      ...Object.values(PERMISSIONS.FACILITY_ADMIN),
      // Servicemen permissions
      ...Object.values(PERMISSIONS.SERVICEMEN),
      // Complaints management
      PERMISSIONS.COMMUNICATIONS.VIEW_COMPLAINT,
      PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT,
      // Documents access
      PERMISSIONS.DOCUMENTATION.VIEW_DOCUMENTS,
    ],
  },

  COMMUNICATIONS_OFFICER: {
    name: "Communications Officer",
    description: "Responsible for cluster communications and announcements",
    hierarchy: 4,
    permissions: [
      // All communications permissions
      ...Object.values(PERMISSIONS.COMMUNICATIONS),
      // All notifications permissions
      ...Object.values(PERMISSIONS.NOTIFICATIONS),
      // Documents access
      PERMISSIONS.DOCUMENTATION.VIEW_DOCUMENTS,
    ],
  },

  FINANCE_OFFICER: {
    name: "Finance Officer",
    description: "Responsible for managing payments and billing",
    hierarchy: 5,
    permissions: [
      // All payments permissions
      ...Object.values(PERMISSIONS.PAYMENTS),
      // Documents access
      PERMISSIONS.DOCUMENTATION.VIEW_DOCUMENTS,
    ],
  },

  RESIDENT: {
    name: "Resident",
    description: "Basic resident role with limited permissions",
    hierarchy: 6,
    permissions: [
      // Access control (limited)
      PERMISSIONS.ACCESS_CONTROL.VIEW_INVITATION,
      PERMISSIONS.ACCESS_CONTROL.MANAGE_INVITATION,
      PERMISSIONS.ACCESS_CONTROL.VIEW_VISIT_REQUEST,
      PERMISSIONS.ACCESS_CONTROL.MANAGE_VISIT_REQUEST,
      PERMISSIONS.ACCESS_CONTROL.VIEW_GUEST,
      PERMISSIONS.ACCESS_CONTROL.VIEW_EVENT,

      // Communications (view only)
      PERMISSIONS.COMMUNICATIONS.VIEW_ANNOUNCEMENT,
      PERMISSIONS.COMMUNICATIONS.VIEW_POLL,
      PERMISSIONS.COMMUNICATIONS.VIEW_OPTIONS,
      PERMISSIONS.COMMUNICATIONS.VIEW_RESPONSES,
      PERMISSIONS.COMMUNICATIONS.VIEW_COMPLAINT,
      PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT,

      // Documentation
      PERMISSIONS.DOCUMENTATION.VIEW_DOCUMENTS,

      // Marketplace
      PERMISSIONS.MARKETPLACE.VIEW_POST,
      PERMISSIONS.MARKETPLACE.VIEW_SELLER,
      PERMISSIONS.MARKETPLACE.VIEW_TAGS,
      PERMISSIONS.MARKETPLACE.VIEW_REVIEW,

      // Notifications
      PERMISSIONS.NOTIFICATIONS.VIEW_NOTIFICATION,
      PERMISSIONS.NOTIFICATIONS.RECEIVE_NOTIFICATIONS,

      // Payments (limited)
      PERMISSIONS.PAYMENTS.VIEW_WALLET,
      PERMISSIONS.PAYMENTS.VIEW_BILL,
      PERMISSIONS.PAYMENTS.PAY_BILLS,
      PERMISSIONS.PAYMENTS.VIEW_TRANSACTION,

      // Servicemen
      PERMISSIONS.SERVICEMEN.VIEW_HANDY_MEN,

      // Staff Tracker
      PERMISSIONS.STAFF_TRACKER.VIEW_DOMESTIC_STAFF,
      PERMISSIONS.STAFF_TRACKER.MANAGE_DOMESTIC_STAFF,

      // Profile
      ...Object.values(PERMISSIONS.PROFILE),
    ],
  },
} as const;

export interface PermissionOptions {
  requireAll?: boolean; // Require all permissions (AND) vs any permission (OR)
  bypassForAdmin?: boolean; // Allow admins to bypass permission checks
}

export const usePermissions = () => {
  const {
    user,
    permissions: userPermissions,
    isAdmin,
    hasPermission: baseHasPermission,
    hasAnyPermission: baseHasAnyPermission,
  } = useAuth();

  // Enhanced permission checking with exact match and role-based checks
  const hasPermission = (
    permission: string,
    options: PermissionOptions = {}
  ) => {
    const { bypassForAdmin = true } = options;

    // Admin bypass (users with Admin role have all permissions)
    if (bypassForAdmin && (isAdmin.value || hasRole("Admin"))) {
      return true;
    }

    // Direct permission check (exact match)
    if (baseHasPermission(permission)) {
      return true;
    }

    // Check if user has the exact permission string
    if (userPermissions.includes(permission)) {
      return true;
    }

    return false;
  };

  // Check multiple permissions
  const hasAnyPermissions = (
    permissions: string[],
    options: PermissionOptions = {}
  ) => {
    const { requireAll = false } = options;

    if (requireAll) {
      return permissions.every((permission) =>
        hasPermission(permission, options)
      );
    } else {
      return permissions.some((permission) =>
        hasPermission(permission, options)
      );
    }
  };

  // Check if user has specific role
  const hasRole = (roleName: string) => {
    return user.value?.roles?.includes(roleName) || false;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roleNames: string[]) => {
    return roleNames.some((role) => hasRole(role));
  };

  // Get user's role hierarchy level (lower number = higher privilege)
  const getRoleHierarchy = () => {
    if (!user.value?.roles) return 999;

    const userRoles = user.value.roles;
    let lowestHierarchy = 999;

    Object.values(ROLES).forEach((role) => {
      if (userRoles.includes(role.name) && role.hierarchy < lowestHierarchy) {
        lowestHierarchy = role.hierarchy;
      }
    });

    return lowestHierarchy;
  };

  // Check if user can perform action on target user based on hierarchy
  const canManageUser = (targetUser: any) => {
    if (isAdmin.value) return true;

    const currentUserHierarchy = getRoleHierarchy();
    const targetUserRoles = targetUser?.roles || [];

    // Find target user's highest privilege level
    let targetHierarchy = 999;
    Object.values(ROLES).forEach((role) => {
      if (
        targetUserRoles.includes(role.name) &&
        role.hierarchy < targetHierarchy
      ) {
        targetHierarchy = role.hierarchy;
      }
    });

    // Can only manage users with lower privilege (higher hierarchy number)
    return currentUserHierarchy < targetHierarchy;
  };

  // UI helpers for conditional rendering
  const canView = (resource: string) => {
    // Map common resource names to actual permissions
    const permissionMap: Record<string, string> = {
      bills: PERMISSIONS.PAYMENTS.VIEW_BILL,
      announcements: PERMISSIONS.COMMUNICATIONS.VIEW_ANNOUNCEMENT,
      users: PERMISSIONS.ACCOUNTS.VIEW_ACCOUNT_USER,
      residents: PERMISSIONS.ACCOUNTS.VIEW_RESIDENTS,
      complaints: PERMISSIONS.COMMUNICATIONS.VIEW_COMPLAINT,
      documents: PERMISSIONS.DOCUMENTATION.VIEW_DOCUMENTS,
      wallet: PERMISSIONS.PAYMENTS.VIEW_WALLET,
      transactions: PERMISSIONS.PAYMENTS.VIEW_TRANSACTION,
      shifts: PERMISSIONS.FACILITY_ADMIN.VIEW_WORK_SHIFT,
      emergency: PERMISSIONS.COMMUNICATIONS.VIEW_EMERGENCY,
    };

    return hasPermission(permissionMap[resource] || resource);
  };

  const canManage = (resource: string) => {
    // Map common resource names to actual permissions
    const permissionMap: Record<string, string> = {
      bills: PERMISSIONS.PAYMENTS.MANAGE_BILL,
      announcements: PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT,
      users: PERMISSIONS.ACCOUNTS.MANAGE_ACCOUNT_USER,
      residents: PERMISSIONS.ACCOUNTS.MANAGE_RESIDENTS,
      complaints: PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT,
      documents: PERMISSIONS.DOCUMENTATION.MANAGE_DOCUMENTS,
      wallet: PERMISSIONS.PAYMENTS.MANAGE_WALLET,
      transactions: PERMISSIONS.PAYMENTS.MANAGE_TRANSACTION,
      shifts: PERMISSIONS.FACILITY_ADMIN.MANAGE_WORK_SHIFT,
      emergency: PERMISSIONS.COMMUNICATIONS.MANAGE_EMERGENCY,
    };

    return hasPermission(permissionMap[resource] || resource);
  };

  // Convenience methods for backward compatibility
  const canCreate = (resource: string) => canManage(resource);
  const canEdit = (resource: string) => canManage(resource);
  const canDelete = (resource: string) => canManage(resource);

  // Module access checks
  const canAccessModule = (moduleName: string) => {
    // Map module names to relevant permissions
    const modulePermissionMap: Record<string, string[]> = {
      payments: [
        PERMISSIONS.PAYMENTS.VIEW_BILL,
        PERMISSIONS.PAYMENTS.VIEW_WALLET,
      ],
      communications: [
        PERMISSIONS.COMMUNICATIONS.VIEW_ANNOUNCEMENT,
        PERMISSIONS.COMMUNICATIONS.VIEW_COMPLAINT,
      ],
      "access-control": [
        PERMISSIONS.ACCESS_CONTROL.VIEW_INVITATION,
        PERMISSIONS.ACCESS_CONTROL.VIEW_GUEST,
      ],
      facility: [
        PERMISSIONS.FACILITY_ADMIN.VIEW_WORK_SHIFT,
        PERMISSIONS.FACILITY_ADMIN.VIEW_WORK_TASK,
      ],
      marketplace: [
        PERMISSIONS.MARKETPLACE.VIEW_POST,
        PERMISSIONS.MARKETPLACE.VIEW_SELLER,
      ],
      security: [
        PERMISSIONS.SECURITY.VIEW_SECURITY_LOG,
        PERMISSIONS.SECURITY.VIEW_SECURITY_ALERT,
      ],
      admin: [
        PERMISSIONS.ADMIN.VIEW_CLUSTER_SETTINGS,
        PERMISSIONS.ADMIN.VIEW_AUDIT_LOG,
      ],
      accounts: [
        PERMISSIONS.ACCOUNTS.VIEW_ACCOUNT_USER,
        PERMISSIONS.ACCOUNTS.VIEW_RESIDENTS,
      ],
      documentation: [PERMISSIONS.DOCUMENTATION.VIEW_DOCUMENTS],
      notifications: [PERMISSIONS.NOTIFICATIONS.VIEW_NOTIFICATION],
      "staff-tracker": [PERMISSIONS.STAFF_TRACKER.VIEW_DOMESTIC_STAFF],
      servicemen: [PERMISSIONS.SERVICEMEN.VIEW_HANDY_MEN],
      profile: [PERMISSIONS.PROFILE.VIEW_PROFILE],
    };

    const modulePermissions = modulePermissionMap[moduleName] || [];
    return modulePermissions.some((permission) => hasPermission(permission));
  };

  // Data filtering based on permissions
  const filterByPermission = <T>(
    items: T[],
    permissionCheck: (item: T) => string | boolean
  ) => {
    return items.filter((item) => {
      const requiredPermission = permissionCheck(item);
      if (typeof requiredPermission === "boolean") {
        return requiredPermission;
      }
      return hasPermission(requiredPermission);
    });
  };

  // Permission-based navigation guards
  const requirePermission = (
    permission: string | string[],
    options: PermissionOptions = {}
  ) => {
    const permissions = Array.isArray(permission) ? permission : [permission];

    if (!hasAnyPermissions(permissions, options)) {
      throw createError({
        statusCode: 403,
        statusMessage: `Access denied. Required permissions: ${permissions.join(
          ", "
        )}`,
      });
    }
  };

  // Component permission helper
  const withPermission = (
    permission: string,
    component: any,
    fallback?: any
  ) => {
    return hasPermission(permission) ? component : fallback || null;
  };

  // Computed properties for common permission checks
  const canManageUsers = computed(() =>
    hasPermission(PERMISSIONS.ACCOUNTS.VIEW_ACCOUNT_USER)
  );
  const canManageBills = computed(() =>
    hasPermission(PERMISSIONS.PAYMENTS.VIEW_BILL)
  );
  const canManageAnnouncements = computed(() =>
    hasPermission(PERMISSIONS.COMMUNICATIONS.VIEW_ANNOUNCEMENT)
  );
  const canManageMaintenance = computed(() =>
    hasPermission(PERMISSIONS.FACILITY_ADMIN.VIEW_WORK_TASK)
  );
  const canManageHelpdesk = computed(() =>
    hasPermission(PERMISSIONS.COMMUNICATIONS.VIEW_COMPLAINT)
  );
  const canManageShifts = computed(() =>
    hasPermission(PERMISSIONS.FACILITY_ADMIN.VIEW_WORK_SHIFT)
  );
  const canManageEmergency = computed(() =>
    hasPermission(PERMISSIONS.COMMUNICATIONS.VIEW_EMERGENCY)
  );

  const availableActions = computed(() => {
    const actions = [];

    if (canManage("bills")) actions.push("create-bill");
    if (canManage("announcements")) actions.push("create-announcement");
    if (canManage("shifts")) actions.push("create-shift");
    if (canManage("complaints")) actions.push("create-complaint");
    if (canManage("emergency")) actions.push("manage-emergency");

    return actions;
  });

  // Permission debugging (development only)
  const debugPermissions = () => {
    if (process.dev) {
      console.group("Permission Debug Info");
      console.log("User:", user.value);
      console.log("Permissions:", userPermissions);
      console.log("Roles:", user.value?.roles);
      console.log("Is Admin:", isAdmin.value);
      console.log("Role Hierarchy:", getRoleHierarchy());
      console.groupEnd();
    }
  };

  return {
    // Constants
    PERMISSIONS: readonly(PERMISSIONS),
    ROLES: readonly(ROLES),

    // Core permission checking
    hasPermission,
    hasAnyPermissions,
    hasRole,
    hasAnyRole,
    canManageUser,

    // UI helpers
    canView,
    canCreate,
    canEdit,
    canDelete,
    canAccessModule,
    withPermission,

    // Data helpers
    filterByPermission,
    requirePermission,

    // Computed permissions
    canManageUsers,
    canManageBills,
    canManageAnnouncements,
    canManageMaintenance,
    canManageHelpdesk,
    canManageShifts,
    canManageEmergency,
    availableActions,

    // Role hierarchy
    getRoleHierarchy,

    // Debug
    debugPermissions,

    // Re-export from useAuth for convenience
    user: readonly(user),
    permissions: readonly(userPermissions),
    isAdmin,
    isAuthenticated: computed(() => !!user.value),
  };
};

// Vue directive for permission-based rendering
export const vPermission = {
  mounted(el: HTMLElement, binding: any) {
    const { hasPermission } = usePermissions();
    const permission = binding.value;

    if (!hasPermission(permission)) {
      el.style.display = "none";
    }
  },
  updated(el: HTMLElement, binding: any) {
    const { hasPermission } = usePermissions();
    const permission = binding.value;

    if (!hasPermission(permission)) {
      el.style.display = "none";
    } else {
      el.style.display = "";
    }
  },
};

// Composable for permission-based form validation
export const usePermissionValidation = () => {
  const { hasPermission } = usePermissions();

  const validatePermissions = (
    formData: any,
    requiredPermissions: Record<string, string>
  ) => {
    const errors: Record<string, string> = {};

    Object.entries(requiredPermissions).forEach(([field, permission]) => {
      if (formData[field] && !hasPermission(permission)) {
        errors[field] = `Insufficient permissions for ${field}`;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return { validatePermissions };
};
