import { hoursToMs, minutesToMs, secondsToMs } from './time';

// TODO: Remove unused code
const TIMESTAMP_RANGE_SEPARATOR = ' --> ' as const;
const TIMESTAMP_PARTS_SEPARATOR = ':' as const;
const TIMESTAMP_MS_SEPARATOR = ',' as const;

const timestampRangeRegExp = new RegExp(`^\\d+:\\d+:\\d+,\\d+\\s*${TIMESTAMP_RANGE_SEPARATOR.trim()}\\s*\\d+:\\d+:\\d+,\\d+$`);

export function checkIsTimeStampRange(text: string): boolean {
  return timestampRangeRegExp.test(text);
}

export function formatTimestampPart(part: number, partLength: number): string {
  return String(part).padStart(partLength, '0');
}

const TIMESTAMP_PART_LENGTH = 2;
const TIMESTAMP_MS_LENGTH = 3;

export function formatTimePartsToTimestamp(hours: number, minutes: number, seconds: number, milliseconds: number) {
  const formattedHours = formatTimestampPart(hours, TIMESTAMP_PART_LENGTH);
  const formattedMinutes = formatTimestampPart(minutes, TIMESTAMP_PART_LENGTH);
  const formattedSeconds = formatTimestampPart(seconds, TIMESTAMP_PART_LENGTH);
  const formattedMilliseconds = formatTimestampPart(milliseconds, TIMESTAMP_MS_LENGTH);

  const formattedSecondsAndMilliseconds = `${formattedSeconds}${TIMESTAMP_MS_SEPARATOR}${formattedMilliseconds}` as const;

  return `${formattedHours}${TIMESTAMP_PARTS_SEPARATOR}${formattedMinutes}${TIMESTAMP_PARTS_SEPARATOR}${formattedSecondsAndMilliseconds}` as const;
}

export function timestampToMilliseconds(timeStamp: string): number {
  const [hours, minutes, secondsAndMilliseconds] = timeStamp.split(TIMESTAMP_PARTS_SEPARATOR);
  const [seconds, milliseconds] = secondsAndMilliseconds.split(TIMESTAMP_MS_SEPARATOR);

  return hoursToMs(hours) + minutesToMs(minutes) + secondsToMs(seconds) + Number(milliseconds);
}

function shiftTimeStamp(timeStamp: string, offset: number): string {
  const updatedTimeInMilliseconds = timestampToMilliseconds(timeStamp) + offset;

  const date = new Date(updatedTimeInMilliseconds);

  return formatTimePartsToTimestamp(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
}

export function shiftTimeStampRange(timeStampRange: string, offset: number): string {
  const [start, end] = timeStampRange.split(TIMESTAMP_RANGE_SEPARATOR);

  const shift = (text: string): string => {
    return shiftTimeStamp(text, offset);
  };

  return `${shift(start)}${TIMESTAMP_RANGE_SEPARATOR}${shift(end)}`;
}
