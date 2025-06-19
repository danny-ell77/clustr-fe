"use client"

import { defineNuxtPlugin } from "#app"
import { useAuth } from "../composables/useAuth"

export default defineNuxtPlugin({
  name: "auth",
  setup() {
    const auth = useAuth()

    // Initialize auth on app start
    auth.fetchUserAndPermissions()

    return {
      provide: {
        auth,
      },
    }
  },
})
