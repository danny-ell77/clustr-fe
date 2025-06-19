import { defineEventHandler } from "h3"
import { getCookie } from "h3"
import { createError } from "h3"

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth-token")

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated",
    })
  }

  // Mock user data based on token - in real app, verify JWT and get from database
  const users = {
    "mock-token-1": {
      id: "1",
      name: "Admin User",
      email: "admin@demo.com",
      role: "Admin",
      roles: ["Admin", "Property Manager", "Security Officer"],
      permissions: [
        "property.view",
        "property.listings.view",
        "property.maintenance.view",
        "property.tenants.view",
        "property.reports.view",
        "accounting.view",
        "accounting.invoices.view",
        "accounting.payments.view",
        "accounting.ewallet.view",
        "security.view",
        "security.users.view",
        "security.roles.view",
        "security.logs.view",
        "security.keys.view",
        "shift.view",
        "shift.logs.view",
        "shift.create",
        "shift.tasks.view",
        "shift.maintenance.view",
        "portal.view",
        "portal.chat.view",
        "portal.meetings.view",
        "portal.announcements.view",
        "portal.polls.view",
        "portal.reports.view",
      ],
    },
    "mock-token-2": {
      id: "2",
      name: "Property Manager",
      email: "manager@demo.com",
      role: "Property Manager",
      roles: ["Property Manager", "Shift Supervisor"],
      permissions: [
        "property.view",
        "property.listings.view",
        "property.maintenance.view",
        "property.tenants.view",
        "shift.view",
        "shift.logs.view",
        "shift.create",
        "shift.tasks.view",
        "portal.view",
        "portal.announcements.view",
      ],
    },
    "mock-token-3": {
      id: "3",
      name: "Basic User",
      email: "user@demo.com",
      role: "Resident",
      roles: ["Resident"],
      permissions: ["portal.view", "portal.chat.view", "portal.meetings.view", "portal.polls.view"],
    },
    "mock-token-4": {
      id: "4",
      name: "Security Officer",
      email: "security@demo.com",
      role: "Security Officer",
      roles: ["Security Officer"],
      permissions: ["security.view", "security.logs.view", "security.users.view", "security.keys.view"],
    },
  }

  const userData = users[token]

  if (!userData) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token",
    })
  }

  return {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      roles: userData.roles,
    },
    permissions: userData.permissions,
  }
})
