/**
 * Composable for accessing formatting utilities
 * Makes formatters available in Vue components similar to Vue 2 filters
 */

import {
  // Date & Time
  formatDate,
  formatDateLong,
  formatDateShort,
  formatTime,
  formatTimeAgo,
  
  // Currency & Numbers
  formatCurrency,
  formatNumber,
  formatPercentage,
  
  // Files & Sizes
  formatFileSize,
  
  // Text
  truncateText,
  capitalizeWords,
  capitalize,
  formatLabel,
  
  // Status & Badges
  getTypeVariant,
  getStatusVariant,
  
  // Contact & Personal
  formatPhone,
  getInitials,
  maskEmail,
  
  // Utilities
  isEmpty,
  formatWithFallback
} from '~/utils/formatters'

/**
 * Composable that provides all formatting utilities
 * Usage: const { formatDate, formatCurrency } = useFormatters()
 */
export const useFormatters = () => {
  return {
    // Date & Time formatters
    formatDate,
    formatDateLong,
    formatDateShort,
    formatTime,
    formatTimeAgo,
    
    // Currency & Number formatters
    formatCurrency,
    formatNumber,
    formatPercentage,
    
    // File & Size formatters
    formatFileSize,
    
    // Text formatters
    truncateText,
    capitalizeWords,
    capitalize,
    formatLabel,
    
    // Status & Badge helpers
    getTypeVariant,
    getStatusVariant,
    
    // Contact & Personal formatters
    formatPhone,
    getInitials,
    maskEmail,
    
    // Utility functions
    isEmpty,
    formatWithFallback
  }
}

// Note: Individual formatters should be imported directly from ~/utils/formatters
// This composable is for use within Vue components only