import { hoursToMs, minutesToMs, secondsToMs, splitTextByLineBreak } from 'shared/helpers';
import {
  VTTTimestampDefault,
  VTTTimestampRangeTemplate,
  VTT_TIMESTAMP_SEPARATORS,
  checkIsVTTTimeStampRange,
} from 'shared/kernel/subtitles';
import { formatTimestampPart } from 'shared/kernel/timestamp';

const TIMESTAMP_PART_LENGTH = 2;
const TIMESTAMP_MS_LENGTH = 3;

function formatTimePartsToTimestamp(
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number
): VTTTimestampDefault {
  const formattedHours = formatTimestampPart(hours, TIMESTAMP_PART_LENGTH);
  const formattedMinutes = formatTimestampPart(minutes, TIMESTAMP_PART_LENGTH);
  const formattedSeconds = formatTimestampPart(seconds, TIMESTAMP_PART_LENGTH);
  const formattedMilliseconds = formatTimestampPart(milliseconds, TIMESTAMP_MS_LENGTH);

  const formattedSecondsAndMilliseconds =
    `${formattedSeconds}${VTT_TIMESTAMP_SEPARATORS.MS}${formattedMilliseconds}` as const;

  return `${formattedHours}${VTT_TIMESTAMP_SEPARATORS.PARTS}${formattedMinutes}${VTT_TIMESTAMP_SEPARATORS.PARTS}${formattedSecondsAndMilliseconds}` as const;
}

export function timestampToMilliseconds(timeStamp: VTTTimestampDefault): number {
  const [hours, minutes, secondsAndMilliseconds] = timeStamp.split(VTT_TIMESTAMP_SEPARATORS.PARTS);
  const [seconds, milliseconds] = secondsAndMilliseconds.split(VTT_TIMESTAMP_SEPARATORS.MS);

  return hoursToMs(hours) + minutesToMs(minutes) + secondsToMs(seconds) + Number(milliseconds);
}

function shiftTimeStamp(timeStamp: VTTTimestampDefault, offset: number): VTTTimestampDefault {
  const updatedTimeInMilliseconds = timestampToMilliseconds(timeStamp) + offset;
  const date = new Date(updatedTimeInMilliseconds);

  return formatTimePartsToTimestamp(
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
}

function proccessTimeStampRange<
  TimeStampRange extends VTTTimestampRangeTemplate<string>,
  CallbackResult extends string,
  TimeStamp extends string = TimeStampRange extends VTTTimestampRangeTemplate<infer A> ? A : never
>(
  timeStampRange: TimeStampRange,
  offset: number,
  callback: (timeStamp: TimeStamp, offset: number) => CallbackResult
): VTTTimestampRangeTemplate<CallbackResult> {
  const [start, end] = timeStampRange.split(VTT_TIMESTAMP_SEPARATORS.RANGE) as [TimeStamp, TimeStamp];

  const shift = (timeStamp: TimeStamp) => {
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
      return proccessTimeStampRange(line, offset, (timeStamp, offset) =>
        shiftTimeStamp(`00${VTT_TIMESTAMP_SEPARATORS.PARTS}${timeStamp}`, offset)
      );
    }
    return line;
  });
}
