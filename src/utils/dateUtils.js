import moment from 'moment-timezone';

// Format date and time in IST timezone with consistent format
export const formatDateTimeIST = (date) => {
  if (!date) return '';
  // Parse as UTC, convert to IST, and format
  return moment.utc(date).tz('Asia/Kolkata').format('MMM D, hh:mm A [IST]');
};

// Format time only in IST timezone
export const formatTimeIST = (date) => {
  if (!date) return '';
  return moment.utc(date).tz('Asia/Kolkata').format('hh:mm A [IST]');
};

// Convert current time to IST
export const getCurrentTimeIST = () => {
  return moment().tz('Asia/Kolkata');
};
