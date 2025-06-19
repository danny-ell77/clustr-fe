import { defineEventHandler, readBody, createError, setCookie } from "h3"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // Mock authentication - in real app, verify against database
  const users = {
    "admin@demo.com": {
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
    "manager@demo.com": {
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
    "user@demo.com": {
      id: "3",
      name: "Basic User",
      email: "user@demo.com",
      role: "Resident",
      roles: ["Resident"],
      permissions: ["portal.view", "portal.chat.view", "portal.meetings.view", "portal.polls.view"],
    },
    "security@demo.com": {
      id: "4",
      name: "Security Officer",
      email: "security@demo.com",
      role: "Security Officer",
      roles: ["Security Officer"],
      permissions: ["security.view", "security.logs.view", "security.users.view", "security.keys.view"],
    },
  }

  const user = users[email]

  if (!user || password !== getPasswordForEmail(email)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    })
  }

  // In real app, generate JWT token
  const token = `mock-token-${user.id}`

  // Set cookie (in real app, use secure HTTP-only cookie)
  setCookie(event, "auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roles: user.roles,
    },
    permissions: user.permissions,
  }
})

function getPasswordForEmail(email: string): string {
  const passwords = {
    "admin@demo.com": "admin123",
    "manager@demo.com": "manager123",
    "user@demo.com": "user123",
    "security@demo.com": "security123",
  }
  return passwords[email] || ""
}
