/**
 * Global formatters plugin
 * Makes formatters available globally in templates via $formatters
 * Similar to Vue 2 global filters
 */

import { useFormatters } from '~/composables/useFormatters'

export default defineNuxtPlugin(() => {
  const formatters = useFormatters()
  
  return {
    provide: {
      formatters
    }
  }
})