export const VTT_TIMESTAMP_SEPARATORS = {
  RANGE: ' --> ',
  PARTS: ':',
  MS: '.',
} as const;

type Separators = typeof VTT_TIMESTAMP_SEPARATORS;

export type VTTTimestampShort = `${string}${Separators['PARTS']}${string}${Separators['MS']}${string}`;
export type VTTTimestampDefault = `${string}${Separators['PARTS']}${string}${Separators['PARTS']}${string}${Separators['MS']}${string}`;

export type VTTTimestampRangeTemplate<Timestamp extends string> = `${Timestamp}${Separators['RANGE']}${Timestamp}`;

export type VTTTimestampRangeShort = VTTTimestampRangeTemplate<VTTTimestampShort>;
export type VTTTimestampRangeDefault = VTTTimestampRangeTemplate<VTTTimestampDefault>;

export type VTTTimestampRange = VTTTimestampRangeShort | VTTTimestampRangeDefault;

function checkIsLongTimeStampRange(text: string): text is VTTTimestampRangeDefault {
  return /^\d+:\d+:\d+.\d+ --> \d+:\d+:\d+.\d+$/.test(text);
}

function checkIsShortTimeStampRange(text: string): text is VTTTimestampRangeShort {
  return /^\d+:\d+\.\d+ --> \d+:\d+\.\d+$/.test(text);
}

export function checkIsVTTTimeStampRange(text: string): text is VTTTimestampRange {
  return checkIsLongTimeStampRange(text) || checkIsShortTimeStampRange(text);
}
checkIsVTTTimeStampRange.isLong = checkIsLongTimeStampRange;
checkIsVTTTimeStampRange.isShort = checkIsShortTimeStampRange;
