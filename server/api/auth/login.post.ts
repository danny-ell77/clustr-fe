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
      permissions: [
        "property.view",
        "property.listings.view",
        "property.maintenance.view",
        "property.tenants.view",
        "accounting.view",
        "accounting.invoices.view",
        "accounting.payments.view",
        "security.view",
        "security.users.view",
        "security.roles.view",
      ],
    },
    "manager@demo.com": {
      id: "2",
      name: "Property Manager",
      email: "manager@demo.com",
      role: "Property Manager",
      permissions: ["property.view", "property.listings.view", "property.maintenance.view", "property.tenants.view"],
    },
    "user@demo.com": {
      id: "3",
      name: "Basic User",
      email: "user@demo.com",
      role: "User",
      permissions: ["property.view", "property.listings.view"],
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
    },
    permissions: user.permissions,
  }
})

function getPasswordForEmail(email: string): string {
  const passwords = {
    "admin@demo.com": "admin123",
    "manager@demo.com": "manager123",
    "user@demo.com": "user123",
  }
  return passwords[email] || ""
}
