export const SRT_TIMESTAMP_SEPARATORS = {
  RANGE: ' --> ',
  PARTS: ':',
  MS: ',',
} as const;

type Separators = typeof SRT_TIMESTAMP_SEPARATORS;

export type SRTTimestamp = `${string}${Separators['PARTS']}${string}${Separators['PARTS']}${string}${Separators['MS']}${string}`;

type TimestampRangeTemplate<Timestamp extends string> = `${Timestamp}${Separators['RANGE']}${Timestamp}`;

export type SRTTimestampRange = TimestampRangeTemplate<SRTTimestamp>;

export function checkIsTimeStampRange(text: string): text is SRTTimestampRange {
  const segment = `\\d{2}:\\d{2}:\\d{2}${SRT_TIMESTAMP_SEPARATORS.MS}\\d+`;

  return new RegExp(`^${segment} --> ${segment}$`).test(text);
}
