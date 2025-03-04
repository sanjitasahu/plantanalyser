/**
 * Format a date string to a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Jan 15, 2023")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date string to include time
 * @param dateString ISO date string
 * @returns Formatted date and time string (e.g., "Jan 15, 2023, 2:30 PM")
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get a relative time string (e.g., "2 days ago", "Just now")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export const getRelativeTimeString = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

/**
 * Calculate days until next watering based on last watered date and frequency
 * @param lastWateredDate ISO date string of last watering
 * @param wateringFrequency String describing watering frequency
 * @returns Number of days until next watering (negative if overdue)
 */
export const getDaysUntilWatering = (
  lastWateredDate: string,
  wateringFrequency: string
): number => {
  if (!lastWateredDate || !wateringFrequency) {
    return 0;
  }
  
  const lastWatered = new Date(lastWateredDate);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(lastWatered.getTime())) {
    return 0;
  }
  
  // Calculate days since last watering
  const diffTime = Math.abs(today.getTime() - lastWatered.getTime());
  const daysSinceWatered = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Determine watering interval based on frequency
  let wateringInterval: number;
  
  switch (wateringFrequency) {
    case 'Daily':
      wateringInterval = 1;
      break;
    case 'Every 2-3 days':
      wateringInterval = 3;
      break;
    case 'Weekly':
      wateringInterval = 7;
      break;
    case 'Bi-weekly':
      wateringInterval = 14;
      break;
    case 'Monthly':
      wateringInterval = 30;
      break;
    default:
      wateringInterval = 7; // Default to weekly
  }
  
  // Calculate days until next watering (negative if overdue)
  return wateringInterval - daysSinceWatered;
}; 