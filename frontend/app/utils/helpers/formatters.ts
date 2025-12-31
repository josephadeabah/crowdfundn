// app/utils/helpers/formatters.ts
export const formatCurrency = (
  amount: number,
  currency: string = 'GHS',
  currencySymbol: string = '₵',
): string => {
  if (isNaN(amount)) return `${currencySymbol}0.00`;

  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? '-' : '';
  return `${sign}${currencySymbol}${formattedAmount}`;
};

export const formatDate = (
  dateString: string | Date,
  format: string = 'MMM dd, yyyy',
): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return 'Invalid date';

  const options: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case 'short':
      options.year = 'numeric';
      options.month = 'short';
      options.day = 'numeric';
      break;
    case 'long':
      options.year = 'numeric';
      options.month = 'long';
      options.day = 'numeric';
      break;
    case 'MMM dd, yyyy':
      options.year = 'numeric';
      options.month = 'short';
      options.day = '2-digit';
      break;
    case 'MMM dd':
      options.month = 'short';
      options.day = '2-digit';
      break;
    case 'MMM yy':
      options.year = '2-digit';
      options.month = 'short';
      break;
    case 'yyyy-MM-dd':
      return date.toISOString().split('T')[0];
    case 'time':
      options.hour = '2-digit';
      options.minute = '2-digit';
      break;
    default:
      options.year = 'numeric';
      options.month = 'short';
      options.day = 'numeric';
  }

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const formatPercentage = (
  value: number,
  decimals: number = 2,
): string => {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  if (isNaN(value)) return '0';

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toFixed(decimals);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatTimeAgo = (dateString: string | Date): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }

  return seconds <= 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
  }

  return phoneNumber;
};

export const truncateText = (
  text: string,
  maxLength: number = 100,
  suffix: string = '...',
): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + suffix;
};

export const formatSocialNumber = (number: number): string => {
  if (isNaN(number)) return '0';

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  } else if (number >= 10000) {
    return `${(number / 1000).toFixed(0)}K`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number.toString();
};

export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const safeToNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

export const safeToFixed = (value: any, decimals: number = 2): string => {
  const num = safeToNumber(value);
  return num.toFixed(decimals);
};

// Add this export at the bottom of the file
export default {
  formatCurrency,
  formatDate,
  formatPercentage,
  formatNumber,
  formatFileSize,
  formatTimeAgo,
  formatPhoneNumber,
  truncateText,
  formatSocialNumber,
  formatDuration,
  safeToNumber,
  safeToFixed,
};
