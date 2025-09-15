/**
 * Common formatting utilities for display purposes
 * These would have been template filters in Vue 2
 */

// =============================================================================
// DATE & TIME FORMATTERS
// =============================================================================

/**
 * Format date to localized string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString("en-US", {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Format date for accounting/invoices (longer format)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateLong = (date) => {
  return formatDate(date, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date for accounting (short format)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (date) => {
  return formatDate(date, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

/**
 * Format time from ISO string
 * @param {string} iso - ISO date string
 * @returns {string} Formatted time string
 */
export const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format relative time (time ago)
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatTimeAgo = (date) => {
  if (!date) return "";

  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

// =============================================================================
// CURRENCY & NUMBER FORMATTERS
// =============================================================================

/**
 * Format currency with Nigerian Naira symbol
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined) return "";

  const formatted = Number(amount).toLocaleString();
  return showSymbol ? `₦${formatted}` : formatted;
};

/**
 * Format number with locale string
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return "";
  return Number(number).toLocaleString();
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return "";
  return `${Number(value).toFixed(decimals)}%`;
};

// =============================================================================
// FILE & SIZE FORMATTERS
// =============================================================================

/**
 * Format file size in bytes to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  if (!bytes) return "";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// =============================================================================
// TEXT FORMATTERS
// =============================================================================

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return "";
  return text.replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Capitalize first letter only
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Replace hyphens/underscores with spaces and capitalize
 * @param {string} text - Text to format
 * @returns {string} Formatted text
 */
export const formatLabel = (text) => {
  if (!text) return "";
  return text.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// =============================================================================
// STATUS & BADGE FORMATTERS
// =============================================================================

/**
 * Get badge variant for report types
 * @param {string} type - Report type
 * @returns {string} Badge variant
 */
export const getTypeVariant = (type) => {
  const variants = {
    maintenance: "default",
    financial: "secondary",
    occupancy: "outline",
    energy: "destructive",
  };
  return variants[type] || "secondary";
};

/**
 * Get badge variant for status
 * @param {string} status - Status value
 * @returns {string} Badge variant
 */
export const getStatusVariant = (status) => {
  const variants = {
    completed: "default",
    in_progress: "secondary",
    pending: "outline",
    active: "default",
    inactive: "secondary",
    paid: "default",
    overdue: "destructive",
    draft: "outline",
  };
  return variants[status] || "secondary";
};

// =============================================================================
// CONTACT & PERSONAL INFO FORMATTERS
// =============================================================================

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return "";

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Nigerian phone number format
  if (cleaned.startsWith("234")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
      6,
      9
    )} ${cleaned.slice(9)}`;
  }

  // Local format
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
};

/**
 * Get initials from full name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}; /**
 * Mask
 email for privacy
 * @param {string} email - Email to mask
 * @returns {string} Masked email
 */
export const maskEmail = (email) => {
  if (!email) return "";
  const [username, domain] = email.split("@");
  if (!domain) return email;

  const maskedUsername =
    username.length > 2
      ? username.slice(0, 2) + "*".repeat(username.length - 2)
      : username;

  return `${maskedUsername}@${domain}`;
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Format value with fallback
 * @param {any} value - Value to format
 * @param {string} fallback - Fallback text
 * @returns {string} Formatted value or fallback
 */
export const formatWithFallback = (value, fallback = "N/A") => {
  return isEmpty(value) ? fallback : String(value);
};
