const MILLISECONDS_PER_HOUR = 3600000; // 1 hour = 60 minutes * 60 seconds * 1000 milliseconds
const MILLISECONDS_PER_MINUTE = 60000; // 1 minute = 60 seconds * 1000 milliseconds
const MILLISECONDS_PER_SECOND = 1000; // 1 second = 1000 milliseconds

export function hoursToMs(hours: number | string) {
  return Number(hours) * MILLISECONDS_PER_HOUR;
}

export function minutesToMs(minutes: number | string) {
  return Number(minutes) * MILLISECONDS_PER_MINUTE;
}

export function secondsToMs(seconds: number | string) {
  return Number(seconds) * MILLISECONDS_PER_SECOND;
}

export function offsetToMs(offset: string | number) {
  const [minutes, seconds] = String(offset).split('.');

  return minutesToMs(minutes) + Number(seconds || 0);
}
