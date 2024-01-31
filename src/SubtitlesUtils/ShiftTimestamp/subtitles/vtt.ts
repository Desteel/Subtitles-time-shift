import { splitTextByLineBreak } from '../../helpers';
import { VTT_TIMESTAMP_SEPARATORS, checkIsVTTTimeStampRange } from '../../subtitles';
import { hoursToMs, minutesToMs, secondsToMs } from '../utils';
import { formatTimestampPart } from './common';

const TIMESTAMP_PART_LENGTH = 2;
const TIMESTAMP_MS_LENGTH = 3;

function formatTimePartsToTimestamp(hours: number, minutes: number, seconds: number, milliseconds: number) {
  const formattedHours = formatTimestampPart(hours, TIMESTAMP_PART_LENGTH);
  const formattedMinutes = formatTimestampPart(minutes, TIMESTAMP_PART_LENGTH);
  const formattedSeconds = formatTimestampPart(seconds, TIMESTAMP_PART_LENGTH);
  const formattedMilliseconds = formatTimestampPart(milliseconds, TIMESTAMP_MS_LENGTH);

  const formattedSecondsAndMilliseconds = `${formattedSeconds}${VTT_TIMESTAMP_SEPARATORS.MS}${formattedMilliseconds}` as const;

  return `${formattedHours}${VTT_TIMESTAMP_SEPARATORS.PARTS}${formattedMinutes}${VTT_TIMESTAMP_SEPARATORS.PARTS}${formattedSecondsAndMilliseconds}` as const;
}

function timestampToMilliseconds(timeStamp: string): number {
  const [hours, minutes, secondsAndMilliseconds] = timeStamp.split(VTT_TIMESTAMP_SEPARATORS.PARTS);
  const [seconds, milliseconds] = secondsAndMilliseconds.split(VTT_TIMESTAMP_SEPARATORS.MS);

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
  const [start, end] = timeStampRange.split(VTT_TIMESTAMP_SEPARATORS.RANGE);

  const shift = (timeStamp: string) => {
    return callback(timeStamp, offset);
  };

  return `${shift(start)}${VTT_TIMESTAMP_SEPARATORS.RANGE}${shift(end)}` as const;
}

export function proccessTextLines(text: string, callback: (line: string, index: number) => string) {
  const splittedText = splitTextByLineBreak(text);

  const updatedParts = splittedText.map(callback);
  return updatedParts.join('\n');
}

export function getVTTWithUpdatedOffset(text: string, offset: number): string {
  return proccessTextLines(text, (line) => {
    if (checkIsVTTTimeStampRange.isLong(line)) {
      return proccessTimeStampRange(line, offset, shiftTimeStamp);
    }
    if (checkIsVTTTimeStampRange.isShort(line)) {
      return proccessTimeStampRange(line, offset, (timeStamp, offset) => shiftTimeStamp(`00${VTT_TIMESTAMP_SEPARATORS.PARTS}${timeStamp}`, offset));
    }
    return line;
  });
}
