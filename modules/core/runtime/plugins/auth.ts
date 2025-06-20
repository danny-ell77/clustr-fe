"use client"

import { defineNuxtPlugin } from "#app"
import { useAuth } from "../composables/useAuth"
import { useAsyncData } from "#app" // Import useAsyncData

export default defineNuxtPlugin({
  name: "auth",
  setup() {
    const auth = useAuth()

    // Initialize auth on app start using useAsyncData for universal fetching
    // This will run on the server during SSR and hydrate on the client without re-fetching
    const { data, error } = useAsyncData(
      "initial-auth-data", // Unique key for caching
      () => auth.fetchUserAndPermissions(),
      {
        lazy: false, // Fetch immediately
        server: true, // Ensure it runs on the server
        // Handle errors during initial fetch
        onError: (err) => {
          console.error("Error fetching initial auth data:", err)
        },
        // Default value in case of error or no data
        default: () => ({ user: null, permissions: [] }),
      },
    )

    // Update the auth composable's state with the fetched data
    // Use watchEffect to react to changes in `data` (e.g., after hydration)
    if (data.value) {
      auth.updateAuthState(data.value.user, data.value.permissions)
    }

    return {
      provide: {
        auth,
      },
    }
  },
})
