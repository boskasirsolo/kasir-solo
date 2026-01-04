
import { INDONESIA_TIMEZONES } from '../data/constants';

export const getTimezoneOffset = (timezoneValue: string): string => {
  const tz = INDONESIA_TIMEZONES.find(t => t.value === timezoneValue);
  const offset = tz ? tz.offset : 7; // Default to 7 (WIB)
  const sign = offset >= 0 ? "+" : "-";
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${sign}${pad(Math.abs(offset))}:00`;
};

// Convert "YYYY-MM-DDTHH:mm" (Wall Clock Time in selected TZ) to UTC ISO String
export const convertLocalToUTC = (localDateStr: string, timezoneValue: string) => {
  if (!localDateStr) return null;
  const offsetStr = getTimezoneOffset(timezoneValue);
  // Construct a fully qualified ISO string with offset: "2023-01-01T10:00:00+07:00"
  // The Date constructor handles the conversion to UTC automatically.
  const date = new Date(`${localDateStr}:00${offsetStr}`);
  return date.toISOString();
};

// Convert UTC ISO String to "YYYY-MM-DDTHH:mm" (Wall Clock Time in selected TZ) for Input Field
export const convertUTCToLocal = (utcDateStr: string, timezoneValue: string) => {
  if (!utcDateStr) return '';
  const date = new Date(utcDateStr);
  
  // Use Intl to format it to the specific timezone's parts
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezoneValue,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  const formatter = new Intl.DateTimeFormat('en-CA', options); // en-CA gives YYYY-MM-DD format usually
  const parts = formatter.formatToParts(date);
  
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '00';
  
  // Reconstruct to YYYY-MM-DDTHH:mm
  return `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}`;
};
