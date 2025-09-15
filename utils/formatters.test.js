/**
 * Test file demonstrating formatter usage
 * Run with: npm test or your preferred test runner
 */

import {
  formatDate,
  formatDateLong,
  formatDateShort,
  formatTime,
  formatTimeAgo,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  truncateText,
  capitalizeWords,
  capitalize,
  formatLabel,
  getTypeVariant,
  getStatusVariant,
  formatPhone,
  getInitials,
  maskEmail,
  isEmpty,
  formatWithFallback
} from './formatters.js'

// Example usage and expected outputs
console.log('=== DATE & TIME FORMATTERS ===')
const testDate = new Date('2024-12-01T14:30:00')
console.log('formatDate:', formatDate(testDate)) // Dec 1, 2024
console.log('formatDateLong:', formatDateLong(testDate)) // December 1, 2024
console.log('formatDateShort:', formatDateShort(testDate)) // 12/01/2024
console.log('formatTime:', formatTime(testDate.toISOString())) // 2:30 PM
console.log('formatTimeAgo:', formatTimeAgo(new Date(Date.now() - 3600000))) // 1 hour ago

console.log('\n=== CURRENCY & NUMBER FORMATTERS ===')
console.log('formatCurrency:', formatCurrency(1500000)) // ₦1,500,000
console.log('formatCurrency (no symbol):', formatCurrency(1500000, false)) // 1,500,000
console.log('formatNumber:', formatNumber(1234567)) // 1,234,567
console.log('formatPercentage:', formatPercentage(85.5)) // 85.5%
console.log('formatPercentage (2 decimals):', formatPercentage(85.567, 2)) // 85.57%

console.log('\n=== FILE & SIZE FORMATTERS ===')
console.log('formatFileSize:', formatFileSize(1024)) // 1 KB
console.log('formatFileSize:', formatFileSize(1048576)) // 1 MB
console.log('formatFileSize:', formatFileSize(1073741824)) // 1 GB

console.log('\n=== TEXT FORMATTERS ===')
console.log('truncateText:', truncateText('This is a very long text that should be truncated', 20)) // This is a very lon...
console.log('capitalizeWords:', capitalizeWords('hello world test')) // Hello World Test
console.log('capitalize:', capitalize('HELLO WORLD')) // Hello world
console.log('formatLabel:', formatLabel('user-name-field')) // User Name Field

console.log('\n=== STATUS & BADGE HELPERS ===')
console.log('getTypeVariant:', getTypeVariant('maintenance')) // default
console.log('getStatusVariant:', getStatusVariant('completed')) // default
console.log('getStatusVariant:', getStatusVariant('pending')) // outline

console.log('\n=== CONTACT & PERSONAL FORMATTERS ===')
console.log('formatPhone:', formatPhone('2348123456789')) // +234 812 345 6789
console.log('formatPhone:', formatPhone('08123456789')) // 0812 345 6789
console.log('getInitials:', getInitials('John Doe Smith')) // JD
console.log('maskEmail:', maskEmail('john.doe@example.com')) // jo*****@example.com

console.log('\n=== UTILITY FUNCTIONS ===')
console.log('isEmpty (null):', isEmpty(null)) // true
console.log('isEmpty (empty string):', isEmpty('')) // true
console.log('isEmpty (empty array):', isEmpty([])) // true
console.log('isEmpty (valid string):', isEmpty('hello')) // false
console.log('formatWithFallback (empty):', formatWithFallback('', 'No data')) // No data
console.log('formatWithFallback (valid):', formatWithFallback('Hello', 'No data')) // Hello