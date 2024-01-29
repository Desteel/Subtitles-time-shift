import { hoursToMs, minutesToMs, secondsToMs } from '../utils';
import { formatTimestampPart } from './common';

const TIMESTAMP_RANGE_SEPARATOR = ' --> ';
const TIMESTAMP_PARTS_SEPARATOR = ':';
const TIMESTAMP_MS_SEPARATOR = '.';

const longTimestampRangeRegExp = /^\d+:\d+:\d+.\d+ --> \d+:\d+:\d+.\d+$/;

const shortTimestampRangeRegExp = /^\d+:\d+\.\d+ --> \d+:\d+\.\d+$/;

function checkIsLongTimeStampRange(text: string): boolean {
  return longTimestampRangeRegExp.test(text);
}

function checkIsShortTimeStampRange(text: string): boolean {
  return shortTimestampRangeRegExp.test(text);
}

const TIMESTAMP_PART_LENGTH = 2;
const TIMESTAMP_MS_LENGTH = 3;

function formatTimePartsToTimestamp(hours: number, minutes: number, seconds: number, milliseconds: number) {
  const formattedHours = formatTimestampPart(hours, TIMESTAMP_PART_LENGTH);
  const formattedMinutes = formatTimestampPart(minutes, TIMESTAMP_PART_LENGTH);
  const formattedSeconds = formatTimestampPart(seconds, TIMESTAMP_PART_LENGTH);
  const formattedMilliseconds = formatTimestampPart(milliseconds, TIMESTAMP_MS_LENGTH);

  const formattedSecondsAndMilliseconds = `${formattedSeconds}${TIMESTAMP_MS_SEPARATOR}${formattedMilliseconds}` as const;

  return `${formattedHours}${TIMESTAMP_PARTS_SEPARATOR}${formattedMinutes}${TIMESTAMP_PARTS_SEPARATOR}${formattedSecondsAndMilliseconds}` as const;
}

function timestampToMilliseconds(timeStamp: string): number {
  const [hours, minutes, secondsAndMilliseconds] = timeStamp.split(TIMESTAMP_PARTS_SEPARATOR);
  const [seconds, milliseconds] = secondsAndMilliseconds.split(TIMESTAMP_MS_SEPARATOR);

  return hoursToMs(hours) + minutesToMs(minutes) + secondsToMs(seconds) + Number(milliseconds);
}

function shiftTimeStamp(timeStamp: string, offset: number) {
  const updatedTimeInMilliseconds = timestampToMilliseconds(timeStamp) + offset;
  const date = new Date(updatedTimeInMilliseconds);

  return formatTimePartsToTimestamp(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
}

function proccessTimeStampRange<CallbackResult extends string>(
  timeStampRange: string,
  offset: number,
  callback: (timeStamp: string, offset: number) => CallbackResult
) {
  const [start, end] = timeStampRange.split(TIMESTAMP_RANGE_SEPARATOR);

  const shift = (timeStamp: string) => {
    return callback(timeStamp, offset);
  };

  return `${shift(start)}${TIMESTAMP_RANGE_SEPARATOR}${shift(end)}` as const;
}

const lineBreakRegExp = /\n/g;

export function proccessTextLines(text: string, callback: (line: string, index: number) => string) {
  const splittedText = text.split(lineBreakRegExp);

  const updatedParts = splittedText.map(callback);
  return updatedParts.join('\n');
}

export function getVTTWithUpdatedOffset(text: string, offset: number): string {
  return proccessTextLines(text, (line) => {
    if (checkIsLongTimeStampRange(line)) {
      return proccessTimeStampRange(line, offset, shiftTimeStamp);
    }
    if (checkIsShortTimeStampRange(line)) {
      return proccessTimeStampRange(line, offset, (timeStamp, offset) => shiftTimeStamp(`00${TIMESTAMP_PARTS_SEPARATOR}${timeStamp}`, offset));
    }
    return line;
  });
}
