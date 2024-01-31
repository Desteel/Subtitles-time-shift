import { splitTextByLineBreak } from '../../helpers';
import { SRT_TIMESTAMP_SEPARATORS, checkIsTimeStampRange } from '../../subtitles';
import { hoursToMs, minutesToMs, secondsToMs } from '../utils';
import { formatTimestampPart } from './common';

const TIMESTAMP_PART_LENGTH = 2;
const TIMESTAMP_MS_LENGTH = 3;

function formatTimePartsToTimestamp(hours: number, minutes: number, seconds: number, milliseconds: number) {
  const formattedHours = formatTimestampPart(hours, TIMESTAMP_PART_LENGTH);
  const formattedMinutes = formatTimestampPart(minutes, TIMESTAMP_PART_LENGTH);
  const formattedSeconds = formatTimestampPart(seconds, TIMESTAMP_PART_LENGTH);
  const formattedMilliseconds = formatTimestampPart(milliseconds, TIMESTAMP_MS_LENGTH);

  const formattedSecondsAndMilliseconds = `${formattedSeconds}${SRT_TIMESTAMP_SEPARATORS.MS}${formattedMilliseconds}` as const;

  return `${formattedHours}${SRT_TIMESTAMP_SEPARATORS.PARTS}${formattedMinutes}${SRT_TIMESTAMP_SEPARATORS.PARTS}${formattedSecondsAndMilliseconds}` as const;
}

function timestampToMilliseconds(timeStamp: string): number {
  const [hours, minutes, secondsAndMilliseconds] = timeStamp.split(SRT_TIMESTAMP_SEPARATORS.PARTS);
  const [seconds, milliseconds] = secondsAndMilliseconds.split(SRT_TIMESTAMP_SEPARATORS.MS);

  return hoursToMs(hours) + minutesToMs(minutes) + secondsToMs(seconds) + Number(milliseconds);
}

function shiftTimeStamp(timeStamp: string, offset: number) {
  const updatedTimeInMilliseconds = timestampToMilliseconds(timeStamp) + offset;
  const date = new Date(updatedTimeInMilliseconds);

  return formatTimePartsToTimestamp(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
}

function shiftTimeStampRange(timeStampRange: string, offset: number) {
  const [start, end] = timeStampRange.split(SRT_TIMESTAMP_SEPARATORS.RANGE);

  const shift = (timeStamp: string) => {
    return shiftTimeStamp(timeStamp, offset);
  };

  return `${shift(start)}${SRT_TIMESTAMP_SEPARATORS.RANGE}${shift(end)}` as const;
}

export function getSRTWithUpdatedOffset(text: string, offset: number): string {
  const splittedText = splitTextByLineBreak(text);

  const updatedParts = splittedText.map((part) => {
    if (checkIsTimeStampRange(part)) {
      return shiftTimeStampRange(part, offset);
    }
    return part;
  });

  return updatedParts.join('\n');
}
