import { formatCurrency, formatDate, formatTime } from "./formatters";

/**
 * Format wallet balance with currency symbol and proper decimal places
 */
export const formatWalletBalance = (amount: number): string => {
  return formatCurrency(amount, "NGN");
};

/**
 * Format transaction type for display
 */
export const formatTransactionType = (type: string): string => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

type StatusMap = {
  [key: string]: { color: string; backgroundColor: string };
};

/**
 * Get transaction status style classes
 */
export const getTransactionStatusStyle = (
  status: keyof StatusMap
): { color: string; backgroundColor: string } => {
  const statusMap: StatusMap = {
    successful: {
      color: "text-green-700",
      backgroundColor: "bg-green-50",
    },
    failed: {
      color: "text-red-700",
      backgroundColor: "bg-red-50",
    },
    pending: {
      color: "text-yellow-700",
      backgroundColor: "bg-yellow-50",
    },
  };

  return statusMap[status.toLowerCase()] || statusMap.pending;
};

/**
 * Format scheduled payment date
 */
export const formatScheduledDate = (date: Date): string => {
  return formatDate(date, "MMM D, YYYY");
};

/**
 * Format scheduled payment time
 */
export const formatScheduledTime = (time: Date): string => {
  return formatTime(time, "hh:mm A");
};

/**
 * Format card number with proper spacing and masking
 */
export const formatCardNumber = (cardNumber: string): string => {
  // Remove any non-digit characters
  const cleaned = cardNumber.replace(/\D/g, "");

  // Mask all but last 4 digits
  const masked = cleaned.slice(-4).padStart(cleaned.length, "*");

  // Add spaces every 4 digits
  return masked.match(/.{1,4}/g)?.join(" ") || masked;
};

/**
 * Validate card expiry date format (MM/YY)
 */
export const isValidExpiryDate = (expiry: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return false;
  }

  const [month, year] = expiry.split("/");
  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10) + 2000; // Convert YY to YYYY

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based

  // Check if month is valid (1-12)
  if (expMonth < 1 || expMonth > 12) {
    return false;
  }

  // Check if expiry date is in the past
  if (
    expYear < currentYear ||
    (expYear === currentYear && expMonth < currentMonth)
  ) {
    return false;
  }

  return true;
};
