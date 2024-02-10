import { hoursToMs, minutesToMs, secondsToMs, splitTextByLineBreak } from 'shared/helpers';
import {
  SRTTimestamp,
  SRTTimestampRange,
  SRT_TIMESTAMP_SEPARATORS,
  checkIsSRTTimeStampRange,
} from 'shared/kernel/subtitles';
import { formatTimestampPart } from 'shared/kernel/timestamp';

const TIMESTAMP_PART_LENGTH = 2;
const TIMESTAMP_MS_LENGTH = 3;

function formatTimePartsToTimestamp(
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number
): SRTTimestamp {
  const formattedHours = formatTimestampPart(hours, TIMESTAMP_PART_LENGTH);
  const formattedMinutes = formatTimestampPart(minutes, TIMESTAMP_PART_LENGTH);
  const formattedSeconds = formatTimestampPart(seconds, TIMESTAMP_PART_LENGTH);
  const formattedMilliseconds = formatTimestampPart(milliseconds, TIMESTAMP_MS_LENGTH);

  const formattedSecondsAndMilliseconds =
    `${formattedSeconds}${SRT_TIMESTAMP_SEPARATORS.MS}${formattedMilliseconds}` as const;

  return `${formattedHours}${SRT_TIMESTAMP_SEPARATORS.PARTS}${formattedMinutes}${SRT_TIMESTAMP_SEPARATORS.PARTS}${formattedSecondsAndMilliseconds}` as const;
}

export function timestampToMilliseconds(timeStamp: SRTTimestamp): number {
  const [hours, minutes, secondsAndMilliseconds] = timeStamp.split(SRT_TIMESTAMP_SEPARATORS.PARTS);
  const [seconds, milliseconds] = secondsAndMilliseconds.split(SRT_TIMESTAMP_SEPARATORS.MS);

  return hoursToMs(hours) + minutesToMs(minutes) + secondsToMs(seconds) + Number(milliseconds);
}

function shiftTimeStamp(timeStamp: SRTTimestamp, offset: number): SRTTimestamp {
  const updatedTimeInMilliseconds = timestampToMilliseconds(timeStamp) + offset;
  const date = new Date(updatedTimeInMilliseconds);

  return formatTimePartsToTimestamp(
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
}

function shiftTimeStampRange(timeStampRange: SRTTimestampRange, offset: number): SRTTimestampRange {
  const [start, end] = timeStampRange.split(SRT_TIMESTAMP_SEPARATORS.RANGE) as [SRTTimestamp, SRTTimestamp];

  const shift = (timeStamp: SRTTimestamp) => {
    return shiftTimeStamp(timeStamp, offset);
  };

  return `${shift(start)}${SRT_TIMESTAMP_SEPARATORS.RANGE}${shift(end)}` as const;
}

export function getSRTWithUpdatedOffset(text: string, offset: number): string {
  const splittedText = splitTextByLineBreak(text);

  const updatedParts = splittedText.map((part) => {
    if (checkIsSRTTimeStampRange(part)) {
      return shiftTimeStampRange(part, offset);
    }
    return part;
  });

  return updatedParts.join('\n');
}
