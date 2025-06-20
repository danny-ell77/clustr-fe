import { defineEventHandler } from "h3";
import { getCookie } from "h3";
import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth-token");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated",
    });
  }

  // Mock user data based on token - in real app, verify JWT and get from database
  const users = {
    "mock-token-1": {
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
    "mock-token-2": {
      id: "2",
      name: "Property Manager",
      email: "manager@demo.com",
      role: "Property Manager",
      permissions: [
        "property.view",
        "property.listings.view",
        "property.maintenance.view",
        "property.tenants.view",
      ],
    },
    "mock-token-3": {
      id: "3",
      name: "Basic User",
      email: "user@demo.com",
      role: "User",
      permissions: ["property.view", "property.listings.view"],
    },
  };

  const userData = users[token];

  if (!userData) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token",
    });
  }

  return {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
    permissions: userData.permissions,
  };
});
