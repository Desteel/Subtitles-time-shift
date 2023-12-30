import { hoursToMs, minutesToMs, secondsToMs } from './time';

const TIMESTAMP_RANGE_SEPARATOR = ' --> ' as const;
const TIMESTAMP_PARTS_SEPARATOR = ':' as const;
const TIMESTAMP_MS_SEPARATOR = ',' as const;

const timestampRangeRegExp = new RegExp(`^\\d+:\\d+:\\d+,\\d+\\s*${TIMESTAMP_RANGE_SEPARATOR.trim()}\\s*\\d+:\\d+:\\d+,\\d+$`);

export function checkIsTimeStampRange(text: string): boolean {
  return timestampRangeRegExp.test(text);
}

function formatTimestampPart(part: number, partLength: number): string {
  return String(part).padStart(partLength, '0');
}

const TIMESTAMP_PART_LENGTH = 2;
const TIMESTAMP_MS_LENGTH = 3;

function formatDateToTimestamp(date: Date): string {
  const hours = formatTimestampPart(date.getUTCHours(), TIMESTAMP_PART_LENGTH);
  const minutes = formatTimestampPart(date.getUTCMinutes(), TIMESTAMP_PART_LENGTH);
  const seconds = formatTimestampPart(date.getUTCSeconds(), TIMESTAMP_PART_LENGTH);
  const milliseconds = formatTimestampPart(date.getUTCMilliseconds(), TIMESTAMP_MS_LENGTH);

  const secondsAndMilliseconds = `${seconds}${TIMESTAMP_MS_SEPARATOR}${milliseconds}`;

  return `${hours}${TIMESTAMP_PARTS_SEPARATOR}${minutes}${TIMESTAMP_PARTS_SEPARATOR}${secondsAndMilliseconds}`;
}

function shiftTimeStamp(timeStamp: string, offset: number): string {
  const [hours, minutes, secondsAndMilliseconds] = timeStamp.split(TIMESTAMP_PARTS_SEPARATOR);
  const [seconds, milliseconds] = secondsAndMilliseconds.split(TIMESTAMP_MS_SEPARATOR);

  const timeInMilliseconds = hoursToMs(hours) + minutesToMs(minutes) + secondsToMs(seconds) + Number(milliseconds);

  const updatedTimeInMilliseconds = timeInMilliseconds + offset;

  const date = new Date(updatedTimeInMilliseconds);

  return formatDateToTimestamp(date);
}

export function shiftTimeStampRange(timeStampRange: string, offset: number): string {
  const [start, end] = timeStampRange.split(TIMESTAMP_RANGE_SEPARATOR);

  const shift = (text: string): string => {
    return shiftTimeStamp(text, offset);
  };

  return `${shift(start)}${TIMESTAMP_RANGE_SEPARATOR}${shift(end)}`;
}
